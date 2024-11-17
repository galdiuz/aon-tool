port module AonTool exposing (main)

import Browser
import Browser.Events
import Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes as HA
import Html.Attributes.Extra as HAE
import Html.Events as HE
import Http
import Json.Decode as Decode
import Json.Decode.Field as Field
import Json.Encode as Encode
import List.Extra
import Markdown.Block
import Markdown.Html
import Markdown.Parser
import Markdown.Renderer
import Maybe.Extra
import Process
import Regex
import String.Extra
import Task


port clipboard_get : () -> Cmd msg
port clipboard_receive : (String -> msg) -> Sub msg
port clipboard_set : String -> Cmd msg
port localStorage_set : Encode.Value -> Cmd msg
port selection_changed : (Decode.Value -> msg) -> Sub msg
port selection_set : Encode.Value -> Cmd msg


type alias Model =
    { aonUrl : String
    , candidates : List Candidate
    , currentCandidate : Maybe Candidate
    , debounce : Int
    , documents : List Document
    , elasticUrl : String
    , ignoreNextTextChanged : Bool
    , manualSearch : String
    , selection : Selection
    , text : String
    , textFocused : Bool
    , undo : Maybe Undo
    }


type Msg
    = AddBrPressed
    | AonUrlChanged String
    | ApplyCandidatePressed Candidate
    | CandidateSelected Candidate
    | ConvertActionsPressed
    | ConvertToListPressed
    | CopyToClipboardPressed
    | CopyFirstSentenceToClipboardPressed
    | DebouncePassed Int
    | ElasticUrlChanged String
    | FixNewlinesPressed
    | FormatActionPressed
    | FormatCritEffectsPressed
    | FormatTraitsPressed
    | GotClipboardContents String
    | GotDataResult (Result Http.Error SearchResult)
    | KeyPressed KeyEvent
    | ManualSearchChanged String
    | PasteFromClipboardPressed
    | RefreshDataPressed
    | SelectionChanged Decode.Value
    | TextChanged String
    | TextFocused Bool
    | UndoPressed
    | WrapWithPressed String String


type alias Flags =
    { localStorage : Dict String String
    }


defaultFlags : Flags
defaultFlags =
    { localStorage = Dict.empty
    }


type alias Document =
    { category : String
    , id : String
    , name : String
    , url : String
    }


type alias Candidate =
    { document : Document
    , index : Int
    }


type alias SearchResult =
    { documents : List Document
    , searchAfter : Encode.Value
    , total : Int
    }


type alias Selection =
    { text : String
    , start : Int
    , end : Int
    }


emptySelection : Selection
emptySelection =
    { text = ""
    , start = 0
    , end = 0
    }


type alias Undo =
    { text : String
    , selection : Selection
    }


type alias KeyEvent =
    { ctrl : Bool
    , key : String
    }


defaultAonUrl : String
defaultAonUrl =
    "https://2e.aonprd.com"


defaultElasticsearchUrl : String
defaultElasticsearchUrl =
    "https://elasticsearch.aonprd.com/aon"


main : Program Decode.Value Model Msg
main =
    Browser.element
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }


init : Decode.Value -> ( Model, Cmd Msg )
init flagsValue =
    let
        flags : Flags
        flags =
            Decode.decodeValue flagsDecoder flagsValue
                |> Result.withDefault defaultFlags
    in
    ( { aonUrl = defaultAonUrl
      , candidates = []
      , currentCandidate = Nothing
      , debounce = 0
      , documents = []
      , elasticUrl = defaultElasticsearchUrl
      , ignoreNextTextChanged = False
      , manualSearch = ""
      , selection = emptySelection
      , text = ""
      , textFocused = False
      , undo = Nothing
      }
        |> \model ->
            List.foldl
                (updateModelFromLocalStorage)
                model
                (Dict.toList flags.localStorage)
    , Cmd.none
    )
        |> (\( model, cmd ) ->
            if List.isEmpty model.documents then
                fetchData Nothing ( model, cmd )

            else
                updateCandidates ( model, cmd )
           )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ clipboard_receive GotClipboardContents
        , selection_changed SelectionChanged
        , Browser.Events.onKeyDown keyEventDecoder
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddBrPressed ->
            ( { model
                | text =
                    String.Extra.insertAt "<br />" model.selection.start model.text
                , undo = Just <| undoFromModel model
              }
            , if model.selection.start == model.selection.end then
                setSelection (model.selection.start + 6) (model.selection.start + 6)

              else
                setSelection model.selection.start (model.selection.end + 6)
            )
                |> updateCandidates

        AonUrlChanged value ->
            ( { model | aonUrl = value }
            , saveToLocalStorage
                "aon-url"
                value
            )

        ApplyCandidatePressed candidate ->
            ( { model
                | text =
                    applyCandidate candidate model.text
                , undo = Just <| undoFromModel model
              }
            , Cmd.none
            )
                |> updateCandidates

        CandidateSelected candidate ->
            ( { model | currentCandidate = Just candidate }
            , Cmd.none
            )

        ConvertActionsPressed ->
            ( { model
                | text =
                    model.text
                        |> String.replace "[one-action]" "<%ACTION.TYPES#2%%>"
                        |> String.replace "[two-actions]" "<%ACTION.TYPES#3%%>"
                        |> String.replace "[three-actions]" "<%ACTION.TYPES#4%%>"
                        |> String.replace "[reaction]" "<%ACTION.TYPES#5%%>"
                        |> String.replace "[free-action]" "<%ACTION.TYPES#6%%>"
              }
            , Cmd.none
            )

        ConvertToListPressed ->
            ( { model
                | text =
                    String.Extra.replaceSlice
                        (model.selection.text
                            |> Regex.split (regexFromString "[\n•]|[\\*\\-] ")
                            |> List.map String.trim
                            |> List.filter (not << String.isEmpty)
                            |> String.join "</li><li>"
                            |> \s -> "<ul><li>" ++ s ++ "</li></ul>"
                        )
                        model.selection.start
                        model.selection.end
                        model.text
                , undo = Just <| undoFromModel model
              }
            , Cmd.none
            )

        CopyToClipboardPressed ->
            ( model
            , clipboard_set model.text
            )

        CopyFirstSentenceToClipboardPressed ->
            ( model
            , clipboard_set
                (model.text
                    |> String.Extra.leftOf "."
                    |> \s -> s ++ "."
                )
            )

        DebouncePassed debounce ->
            if model.debounce == debounce then
                ( model
                , Cmd.none
                )
                    |> updateCandidates

            else
                ( model, Cmd.none )

        ElasticUrlChanged value ->
            ( { model | elasticUrl = value }
            , saveToLocalStorage
                "elasticsearch-url"
                value
            )

        FixNewlinesPressed ->
            let
                lines : List String
                lines =
                    String.split "\n" model.text

                median : Int
                median =
                    lines
                        |> List.map String.length
                        |> List.Extra.getAt (List.length lines // 2)
                        |> Maybe.withDefault 0

                fixed : String
                fixed =
                    lines
                        |> List.map String.trim
                        |> List.filter (not << String.isEmpty)
                        |> List.Extra.groupWhile
                            (\a b ->
                                not (String.endsWith "." a)
                                    || String.startsWith "• " b
                                    || String.length a > median - 10
                            )
                        |> List.map
                            (\( first, rest ) ->
                                first ++ " " ++ String.join " " rest
                            )
                        |> String.join "<br /><br />"
                        |> String.trim
            in
            ( { model
                | text = fixed
                , undo = Just <| undoFromModel model
              }
            , Cmd.none
            )
                |> updateCandidates

        FormatActionPressed ->
            ( { model
                | text =
                    Regex.replace
                        (regexFromString "(?:Activate—)?(.*) (\\[.*\\]) (\\(.*\\))? ?(?:Trigger (.*?(?=;)); )?(?:Frequency (.*?(?=;)); )?(?:Requirements (.*?(?=;)); )?(?:Effect (.*))")
                        (\match ->
                            [ "NULL" -- ActionsID
                            , getSubmatch 2 "" match -- Name
                            , getSubmatch 2 "NULL" match -- NameDisplay
                            , getSubmatch 0 "NULL" match -- TitleName
                            , "NULL" -- SourcesID
                            , "NULL" -- Page
                            , "NULL" -- TableName
                            , "NULL" -- ObjectID
                            , getSubmatch 1 "NULL" match -- ActionTypesID
                                |> actionIdFromString
                            , getSubmatch 6 "NULL" match -- Description
                            , "NULL" -- ProficienciesID
                            , "0" -- BasicAction
                            , "0" -- SpecialBasicAction
                            , "NULL" -- Prerequisites
                            , getSubmatch 3 "NULL" match -- Trigger
                            , getSubmatch 5 "NULL" match -- Requirements
                            , getSubmatch 4 "NULL" match -- Frequency
                            , "NULL" -- Cost
                            , "NULL" -- CriticalEffectsID
                            , "1" -- ActivateAction
                            , "NULL" -- ActivateSource
                            , "NULL" -- LegacyID
                            ]
                                |> List.map String.trim
                                |> String.join "\t"
                        )
                        (model.text
                            |> String.replace "\r" ""
                            |> String.replace "\n" " "
                            |> String.Extra.clean
                        )
                , undo = Just <| undoFromModel model
              }
            , Cmd.none
            )
                |> updateCandidates

        FormatCritEffectsPressed ->
            ( { model
                | text =
                    Regex.replace
                        (regexFromString "^.*?(Critical Success (.*?(?=Success)|$))?(Success (.*?((?=Failure)|$)))?(Failure (.*?((?=Critical Failure)|$)))?(Critical Failure (.*))?$")
                        (\match ->
                            [ getSubmatch 1 "NULL" match
                            , getSubmatch 3 "NULL" match
                            , getSubmatch 6 "NULL" match
                            , getSubmatch 9 "NULL" match
                            ]
                                |> List.map String.trim
                                |> String.join "\t"
                        )
                        (model.text
                            |> String.replace "\r" ""
                            |> String.replace "\n" " "
                            |> String.Extra.clean
                        )
                , undo = Just <| undoFromModel model
              }
            , Cmd.none
            )
                |> updateCandidates

        FormatTraitsPressed ->
            ( { model
                | text =
                    model.documents
                        |> List.filter (.category >> (==) "trait")
                        |> List.sortBy (.name >> String.length)
                        |> List.reverse
                        |> List.foldl
                            (\document result ->
                                if String.contains (String.toLower document.name) result.text then
                                    let
                                        firstMatch : Maybe Regex.Match
                                        firstMatch =
                                            Regex.find
                                                (regexFromString ("(?<![a-zA-Z%])" ++ escapeRegex document.name ++ "(?![a-zA-Z%])"))
                                                result.text
                                                |> List.head

                                        traitId : String
                                        traitId =
                                            String.replace "trait-" "" document.id
                                    in
                                    case firstMatch of
                                        Just match ->
                                            { result
                                                | text =
                                                    String.Extra.replaceSlice
                                                        ""
                                                        match.index
                                                        (match.index + String.length document.name)
                                                        result.text
                                                , traits = { id = traitId, name = document.name } :: result.traits
                                            }

                                        Nothing ->
                                            result

                                else
                                    result
                            )
                            { text = String.toLower model.text
                            , traits = []
                            }
                        |> .traits
                        |> List.sortBy .name
                        |> List.map (\trait -> trait.id ++ "\t" ++ trait.name)
                        |> String.join "\n"
              }
            , Cmd.none
            )
                |> updateCandidates

        GotClipboardContents value ->
            ( { model
                | manualSearch = ""
                , selection = emptySelection
                , text = String.replace "\r" "" value
              }
            , Cmd.none
            )
                |> updateCandidates

        GotDataResult result ->
            case result of
                Ok searchResult ->
                    ( { model
                        | documents =
                            searchResult.documents
                                |> List.concatMap explodePersistentDamage
                                |> List.append model.documents
                      }
                    , Cmd.none
                    )
                        |> (if List.length searchResult.documents < dataSize then
                                (\( m, cmd ) ->
                                    ( m
                                    , saveToLocalStorage
                                        "data"
                                        (Encode.list encodeDocument m.documents
                                            |> Encode.encode 0
                                        )
                                    )
                                )

                            else
                                fetchData (Just searchResult.searchAfter)
                           )

                Err _ ->
                    ( model, Cmd.none )

        PasteFromClipboardPressed ->
            ( model
            , clipboard_get ()
            )

        KeyPressed event ->
            if event.ctrl && event.key == "b" then
                update (WrapWithPressed "<b>" "</b>") model

            else if event.ctrl && event.key == "i" then
                update (WrapWithPressed "<i>" "</i>") model

            else if event.ctrl && event.key == "u" then
                update (WrapWithPressed "<u>" "</u>") model

            else if event.ctrl && event.key == "z" then
                update UndoPressed model

            else if event.ctrl && event.key == " " then
                update FixNewlinesPressed model

            else if event.ctrl && event.key == "Enter" then
                update AddBrPressed model

            else
                ( model
                , Cmd.none
                )

        ManualSearchChanged value ->
            ( { model
                | debounce = model.debounce + 1
                , manualSearch = value
              }
            , Process.sleep 250
                |> Task.perform (\_ -> DebouncePassed (model.debounce + 1))
            )

        RefreshDataPressed ->
            ( { model | documents = [] }
            , Cmd.none
            )
                |> fetchData Nothing

        SelectionChanged value ->
            let
                selection : Selection
                selection =
                    value
                        |> Decode.decodeValue selectionDecoder
                        |> Result.withDefault emptySelection
            in
            ( { model
                | debounce = model.debounce + 1
                , ignoreNextTextChanged = False
                , manualSearch = String.trim selection.text
                , selection = selection
              }
            , Process.sleep 250
                |> Task.perform (\_ -> DebouncePassed (model.debounce + 1))
            )

        TextChanged text ->
            if model.ignoreNextTextChanged then
                ( model
                , Cmd.none
                )

            else
                ( { model
                    | debounce = model.debounce + 1
                    , selection = emptySelection
                    , text = String.replace "\r" "" text
                    , undo = Nothing
                  }
                , Cmd.none
                )

        TextFocused focused ->
            ( { model | textFocused = focused }
            , Cmd.none
            )

        UndoPressed ->
            case model.undo of
                Just undo ->
                    ( { model
                        | text = undo.text
                        , ignoreNextTextChanged = True
                        , undo = Nothing
                      }
                    , setSelection undo.selection.start undo.selection.end
                    )

                Nothing ->
                    ( model
                    , Cmd.none
                    )

        WrapWithPressed start end ->
            let
                length : Int
                length =
                    String.length start + String.length end
            in
            ( { model
                | text =
                    model.text
                        |> String.Extra.insertAt end model.selection.end
                        |> String.Extra.insertAt start model.selection.start
                , undo = Just <| undoFromModel model
              }
            , if model.selection.start == model.selection.end then
                setSelection (model.selection.start + length) (model.selection.start + length)

              else
                setSelection model.selection.start (model.selection.end + length)

            )
                |> updateCandidates


undoFromModel : Model -> Undo
undoFromModel model =
    { text = model.text
    , selection = model.selection
    }


explodePersistentDamage : Document -> List Document
explodePersistentDamage document =
    if document.name == "Persistent Damage" && document.category == "condition" then
        List.map
            (\damageType ->
                { document
                    | id = document.id ++ "-" ++ damageType
                    , name = "Persistent " ++ damageType ++ " Damage"
                }
            )
            [ "Acid"
            , "Area"
            , "Bleed"
            , "Bludgeoning"
            , "Chaotic"
            , "Cold"
            , "Electricity"
            , "Evil"
            , "Fire"
            , "Force"
            , "Good"
            , "Holy"
            , "Lawful"
            , "Mental"
            , "Negative"
            , "Piercing"
            , "Poison"
            , "Positive"
            , "Slashing"
            , "Sonic"
            , "Spirit"
            , "Splashing"
            , "Unholy"
            ]
            |> (::) document

    else
        [ document ]


flagsDecoder : Decode.Decoder Flags
flagsDecoder =
    Field.attempt "localStorage" (Decode.dict Decode.string) <| \localStorage ->
    Decode.succeed
        { localStorage = Maybe.withDefault defaultFlags.localStorage localStorage
        }


keyEventDecoder : Decode.Decoder Msg
keyEventDecoder =
    Field.require "ctrlKey" Decode.bool <| \ctrl ->
    Field.require "key" Decode.string <| \key ->
    Decode.succeed
        { ctrl = ctrl
        , key = key
        }
        |> Decode.map KeyPressed


updateModelFromLocalStorage : ( String, String ) -> Model -> Model
updateModelFromLocalStorage ( key, value ) model =
    case key of
        "aon-url" ->
            if String.isEmpty value then
                model

            else
                { model | aonUrl = value }

        "data" ->
            case Decode.decodeString (Decode.list documentDecoder) value of
                Ok documents ->
                    { model | documents = documents }

                Err _ ->
                    model

        "elasticsearch-url" ->
            if String.isEmpty value then
                model

            else
                { model | elasticUrl = value }

        _ ->
            model


setSelection : Int -> Int -> Cmd msg
setSelection start end =
    selection_set
        (Encode.object
            [ ( "start", Encode.int start )
            , ( "end", Encode.int end )
            ]
        )


saveToLocalStorage : String -> String -> Cmd msg
saveToLocalStorage key value =
    localStorage_set
        (Encode.object
            [ ( "key", Encode.string key )
            , ( "value", Encode.string value )
            ]
        )


fetchData : Maybe Encode.Value -> ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
fetchData searchAfter ( model, cmd ) =
    ( model
    , Cmd.batch
        [ cmd
        , Http.request
            { method = "POST"
            , url = model.elasticUrl ++ "/_search?track_total_hits=true"
            , headers = []
            , body = Http.jsonBody (buildDataBody model searchAfter)
            , expect = Http.expectJson GotDataResult esResultDecoder
            , timeout = Just 10000
            , tracker = Nothing
            }
        ]
    )


buildDataBody : Model -> Maybe Encode.Value -> Encode.Value
buildDataBody model searchAfter =
    encodeObjectMaybe
        [ Just
            ( "query"
            , Encode.object
                [ ( "bool"
                  , Encode.object
                        [ ( "must_not"
                          , Encode.list Encode.object
                              [ [ ( "term"
                                  , Encode.object
                                        [ ( "exclude_from_search", Encode.bool True ) ]
                                  )
                                ]
                              ]
                          )
                        , ( "should"
                          , Encode.list Encode.object
                                [ [ ( "query_string"
                                  , Encode.object
                                        [ ( "query", Encode.string "!category:(category-page OR class-feature OR sidebar) !remaster_id:*" )
                                        , ( "default_operator", Encode.string "AND" )
                                        ]
                                  )
                                ] ]
                          )
                        ]
                  )
                ]
            )
        , Just
            ( "size"
            , Encode.int dataSize
            )
        , ( "sort"
          , Encode.list identity
                [ Encode.string "_score"
                , Encode.string "_doc"
                ]
          )
            |> Just
        , Maybe.map (Tuple.pair "search_after") searchAfter
        , Just
            ( "_source"
            , Encode.object
                [ ( "includes"
                  , Encode.list Encode.string
                        [ "category"
                        , "name"
                        , "url"
                        ]
                  )
                ]
            )
        ]


dataSize : Int
dataSize =
    10000


encodeObjectMaybe : List (Maybe ( String, Encode.Value )) -> Encode.Value
encodeObjectMaybe list =
    Maybe.Extra.values list
        |> Encode.object


esResultDecoder : Decode.Decoder SearchResult
esResultDecoder =
    Field.requireAt [ "hits", "hits" ] (Decode.list documentDecoder) <| \documents ->
    Field.requireAt [ "hits", "hits" ] (Decode.list (Decode.field "sort" Decode.value)) <| \sorts ->
    Field.requireAt [ "hits", "total", "value" ] Decode.int <| \total ->
    Decode.succeed
        { documents = documents
        , searchAfter =
            sorts
                |> List.Extra.last
                |> Maybe.withDefault Encode.null
        , total = total
        }


documentDecoder : Decode.Decoder Document
documentDecoder =
    Field.require "_id" Decode.string <| \id ->
    Field.requireAt [ "_source", "category" ] Decode.string <| \category ->
    Field.requireAt [ "_source", "name" ] Decode.string <| \name ->
    Field.requireAt [ "_source", "url" ] Decode.string <| \url ->
    Decode.succeed
        { category = category
        , id = id
        , name = name
        , url = url
        }


encodeDocument : Document -> Encode.Value
encodeDocument document =
    Encode.object
        [ ( "_id", Encode.string document.id )
        , ( "_source"
          , Encode.object
                [ ( "category", Encode.string document.category )
                , ( "name", Encode.string document.name )
                , ( "url", Encode.string document.url )
                ]
          )
        ]


updateCandidates : ( Model, Cmd Msg ) -> ( Model, Cmd Msg )
updateCandidates ( model, cmd ) =
    let
        candidates : List Candidate
        candidates =
            model.documents
                |> List.filter
                    (\document ->
                        String.contains (String.toLower document.name) (String.toLower model.text)
                            && not (List.member
                                document.id
                                [ "action-1167" -- Strike
                                , "creature-1969" -- I
                                , "rules-33" -- Perception
                                , "rules-90" -- Perception
                                , "rules-2040" -- Perception
                                , "rules-2882" -- Perception
                                , "rules-2586" -- Difficult Terrain
                                , "rules-2559" -- Cover
                                , "rules-165" -- Movement
                                , "rules-2271" -- Movement
                                , "rules-2188" -- Multiple Attack Penalty
                                , "rules-2624" -- Time
                                ]
                            )
                            && not (document.category == "rules"
                                && List.member
                                    document.name
                                    [ "Attack"
                                    , "Bulk"
                                    , "Checks"
                                    , "Critical Failure"
                                    , "Critical Success"
                                    , "Damage"
                                    , "Effect"
                                    , "Effects"
                                    , "Example"
                                    , "Feat"
                                    , "Group"
                                    , "Hands"
                                    , "Hit Points"
                                    , "Level"
                                    , "Round"
                                    , "Saving Throw"
                                    , "Saving Throws"
                                    , "Senses"
                                    , "Size"
                                    , "Skill"
                                    , "Skills"
                                    , "Speed"
                                    , "Spell"
                                    , "Spells"
                                    , "Trait"
                                    , "Traits"
                                    , "Turn"
                                    , "Weapons"
                                    ]
                                )
                    )
                |> List.concatMap
                    (\document ->
                        Regex.find
                            (regexFromString ("(?<![a-zA-Z%])" ++ escapeRegex document.name ++ "(?![a-zA-Z%])"))
                            model.text
                            |> List.map
                                (\match ->
                                    { document = document
                                    , index = match.index
                                    }
                                )
                    )
                |> List.filter
                    (\candidate ->
                        if model.selection.text /= "" then
                            candidate.index >= model.selection.start
                                && candidate.index < model.selection.end

                        else
                            True
                    )
                |> List.sortWith
                    (\a b ->
                        case compare a.index b.index of
                            LT ->
                                LT

                            EQ ->
                                compare (String.length b.document.name) (String.length a.document.name)

                            GT ->
                                GT
                    )
    in
    ( { model
        | candidates = candidates
        , currentCandidate = Nothing
      }
    , cmd
    )


regexFromString : String -> Regex.Regex
regexFromString string =
    Regex.fromStringWith
        { caseInsensitive = True
        , multiline = True
        }
        string
        |> Maybe.withDefault Regex.never


escapeRegex : String -> String
escapeRegex string =
    string
        |> String.replace "\\" "\\\\"
        |> String.replace "^" "\\^"
        |> String.replace "$" "\\$"
        |> String.replace "." "\\."
        |> String.replace "|" "\\|"
        |> String.replace "?" "\\?"
        |> String.replace "*" "\\*"
        |> String.replace "+" "\\+"
        |> String.replace "(" "\\("
        |> String.replace ")" "\\)"
        |> String.replace "[" "\\["
        |> String.replace "]" "\\]"
        |> String.replace "{" "\\{"
        |> String.replace "}" "\\}"


applyCandidate : Candidate -> String -> String
applyCandidate candidate text =
    let
        endIndex : Int
        endIndex =
            candidate.index + String.length candidate.document.name
    in
    String.Extra.replaceSlice
        (addLinkTag candidate.document (String.slice candidate.index endIndex text))
        candidate.index
        endIndex
        text


isCandidateInATag : Candidate -> String -> Bool
isCandidateInATag candidate rawText =
    let
        text : String
        text =
            Regex.replace
                (regexFromString "<%(ACTION(S|.TYPES)|TABLESHTML)#(.+?)%%>")
                (\match -> "")
                rawText

        openIndices : List Int
        openIndices =
            String.indices "%%>" text

        closeIndices : List Int
        closeIndices =
            String.indices "<%END>" text

        openIndicesBefore : Int
        openIndicesBefore =
            openIndices
                |> List.filter (\i -> i < candidate.index)
                |> List.length

        closeIndicesBefore : Int
        closeIndicesBefore =
            closeIndices
                |> List.filter (\i -> i < candidate.index)
                |> List.length
    in
    openIndicesBefore /= closeIndicesBefore


addLinkTag : Document -> String -> String
addLinkTag document string =
    if document.category == "spell" then
        getDocumentLink document ++ "<i>" ++ string ++ "</i><%END>"

    else
        getDocumentLink document ++ string ++ "<%END>"


getDocumentLink : Document -> String
getDocumentLink document =
    "<%" ++ getDocumentLinkCode document ++ "%" ++ getDocumentLinkId document ++ "%%>"


getDocumentLinkId : Document -> String
getDocumentLinkId document =
    document.id
        |> Regex.find (regexFromString ".*?-([0-9]+)")
        |> List.head
        |> Maybe.map .submatches
        |> Maybe.andThen List.head
        |> Maybe.Extra.join
        |> Maybe.withDefault document.id


getDocumentLinkCode : Document -> String
getDocumentLinkCode document =
    case document.category of
        "action" -> "ACTIONS"
        "ancestry" -> "ANCESTRIES"
        "animal-companion" -> "COMPANIONS"
        "animal-companion-advanced" -> "ANIMAL.COMPANIONS.ADVANCED"
        "animal-companion-specialization" -> "ANIMAL.COMPANIONS.SPECIALIZED"
        "animal-companion-unique" -> "ANIMAL.COMPANIONS.UNIQUE"
        "arcane-school" -> "CLASS.ARCANE.SCHOOLS"
        "arcane-thesis" -> "CLASS.ARCANE.THESIS"
        "archetype" -> "ARCHETYPES"
        "armor" -> "ARMOR"
        "armor-specialization" -> "ARMOR.GROUPS"
        "article" -> "ARTICLES"
        "background" -> "BACKGROUNDS"
        "bloodline" -> "CLASS.BLOODLINES"
        "campsite-meal" -> "CAMPSITE.MEALS"
        "cause" -> "CLASS.CHAMPION.CAUSES"
        "class" -> "CLASSES"
        "condition" -> "CONDITIONS"
        "conscious-mind" -> "CLASS.CONSCIOUS.MINDS"
        "creature" -> "MONSTERS"
        "creature-ability" -> "UMR"
        "creature-family" -> "MON.FAMILY"
        "creature-theme-template" -> "" -- Missing
        "curse" -> "CURSES"
        "deity" -> "DEITIES"
        "deity-category" -> "DEITY.CATEGORIES"
        "deviant-ability-classification" -> "FEATS.DEVIANT"
        "disease" -> "DISEASES"
        "doctrine" -> "CLASS.DOCTRINES"
        "domain" -> "DOMAINS"
        "druidic-order" -> "CLASS.DRUID.ORDERS"
        "eidolon" -> "EIDOLONS"
        "element" -> "CLASS.ELEMENTS"
        "equipment" -> "EQUIPMENT"
        "familiar-ability" -> "FAMILIAR.ABILITIES"
        "familiar-specific" -> "FAMILIARS.SPECIFIC"
        "feat" -> "FEATS"
        "hazard" -> "HAZARDS"
        "hellknight-order" -> "" -- Missing
        "heritage" -> "HERITAGES"
        "hunters-edge" -> "CLASS.HUNTERS.EDGES"
        "hybrid-study" -> "CLASS.HYBRID.STUDIES"
        "implement" -> "CLASS.IMPLEMENTS"
        "innovation" -> "CLASS.INNOVATIONS"
        "instinct" -> "CLASS.INSTINCTS"
        "kingdom-event" -> "KINGDOM.EVENTS"
        "kingdom-structure" -> "KINGDOM.STRUCTURES"
        "language" -> "LANGUAGES"
        "lesson" -> "CLASS.WITCH.LESSONS"
        "methodology" -> "CLASS.METHODOLOGIES"
        "muse" -> "CLASS.MUSES"
        "mystery" -> "CLASS.MYSTERIES"
        "patron" -> "CLASS.WITCH.PATRONS"
        "plane" -> "PLANES"
        "racket" -> "CLASS.RACKETS"
        "relic" -> "RELIC.GIFTS"
        "research-field" -> "CLASS.RESEARCH.FIELDS"
        "ritual" -> "RITUALS"
        "rules" -> "RULES"
        "set-relic" -> "" -- Missing
        "shield" -> "SHIELDS"
        "siege-weapon" -> "SIEGE.WEAPONS"
        "skill" -> "SKILLS"
        "skill-general-action" -> "SKILLS.GENERAL"
        "source" -> "SOURCES"
        "spell" -> "SPELLS"
        "style" -> "CLASS.SWASH.STYLES"
        "subconscious-mind" -> "CLASS.SUBCONSCIOUS.MINDS"
        "tenet" -> "CLASS.TENETS"
        "tradition" -> "TRADITIONS"
        "trait" -> "TRAITS"
        "vehicle" -> "VEHICLES"
        "warfare-army" -> "" -- Missing
        "warfare-tactic" -> "WARFARE.TACTICS"
        "way" -> "CLASS.WAYS"
        "weapon-group" -> "WEAPON.GROUPS"
        "weapon" -> "WEAPONS"
        "weather-hazard" -> "HAZARDS.WEATHER"
        _ -> ""


linkCodeToUrl : String -> String
linkCodeToUrl code =
    case code of
        "ACTIONS" -> "/Actions.aspx?ID="
        "ALCHEMICAL.CATEGORIES" -> "/Equipment.aspx?Category=6&Subcategory="
        "ANCESTRIES" -> "/Ancestries.aspx?ID="
        "ANIMAL.COMPANIONS.ADVANCED" -> "/AnimalCompanions.aspx?Advanced=true&ID="
        "ANIMAL.COMPANIONS.SPECIALIZED" -> "/AnimalCompanions.aspx?Specialized=true&ID="
        "ANIMAL.COMPANIONS.UNIQUE" -> "/AnimalCompanions.aspx?Unique=true&ID="
        "ARCHETYPES" -> "/Archetypes.aspx?ID="
        "ARMOR" -> "/Armor.aspx?ID="
        "ARMOR.GROUPS" -> "/ArmorGroups.aspx?ID="
        "ARTICLES" -> "/Articles.aspx?ID="
        "BACKGROUNDS" -> "/Backgrounds.aspx?ID="
        "CAMPSITE.MEALS" -> "/CampMeals.aspx?ID="
        "CLASS.ARCANE.SCHOOLS" -> "/ArcaneSchools.aspx?ID="
        "CLASS.ARCANE.THESIS" -> "/ArcaneThesis.aspx?ID="
        "CLASS.BLOODLINES" -> "/Bloodlines.aspx?ID="
        "CLASS.CHAMPION.CAUSES" -> "/Causes.aspx?ID="
        "CLASS.CONSCIOUS.MINDS" -> "/ConsciousMinds.aspx?ID="
        "CLASS.DOCTRINES" -> "/Doctrines.aspx?ID="
        "CLASS.DRUID.ORDERS" -> "/DruidicOrders.aspx?ID="
        "CLASS.ELEMENTS" -> "/Elements.aspx?ID="
        "CLASS.HUNTERS.EDGES" -> "/HuntersEdge.aspx?ID="
        "CLASS.HYBRID.STUDIES" -> "/HybridStudies.aspx?ID="
        "CLASS.IMPLEMENTS" -> "/Implements.aspx?ID="
        "CLASS.INNOVATIONS" -> "/Innovations.aspx?ID="
        "CLASS.INSTINCTS" -> "/Instincts.aspx?ID="
        "CLASS.METHODOLOGIES" -> "/Methodologies.aspx?ID="
        "CLASS.MUSES" -> "/Muses.aspx?ID="
        "CLASS.MYSTERIES" -> "/Mysteries.aspx?ID="
        "CLASS.RACKETS" -> "/Rackets.aspx?ID="
        "CLASS.RESEARCH.FIELDS" -> "/ResearchFields.aspx?ID="
        "CLASS.SUBCONSCIOUS.MINDS" -> "/SubconsciousMinds.aspx?ID="
        "CLASS.SWASH.STYLES" -> "/Styles.aspx?ID="
        "CLASS.TENETS" -> "/Tenets.aspx?ID="
        "CLASS.WAYS" -> "/Ways.aspx?ID="
        "CLASS.WITCH.LESSONS" -> "/Lessons.aspx?ID="
        "CLASS.WITCH.PATRONS" -> "/Patrons.aspx?ID="
        "CLASSES" -> "/Classes.aspx?ID="
        "COMPANIONS" -> "/AnimalCompanions.aspx?ID="
        "CONDITIONS" -> "/Conditions.aspx?ID="
        "CURSES" -> "/Curses.aspx?ID="
        "DEITIES" -> "/Deities.aspx?ID="
        "DEITY.CATEGORIES" -> "/DeityCategories.aspx?ID="
        "DISEASES" -> "/Diseases.aspx?ID="
        "DOMAINS" -> "/Domains.aspx?ID="
        "EIDOLONS" -> "/Eidolons.aspx?ID="
        "EQUIPMENT" -> "/Equipment.aspx?ID="
        "FAMILIAR.ABILITIES" -> "/Familiars.aspx?ID="
        "FAMILIARS.SPECIFIC" -> "/Familiars.aspx?Specific=true&ID="
        "FEATS" -> "/Feats.aspx?ID="
        "FEATS.DEVIANT" -> "/DeviantFeats.aspx?ID="
        "GEAR.ARMOR.CATEGORY" -> "/Equipment.aspx?Category=11&Subcategory="
        "GEAR.SHIELDS.ALL" -> "/Shields.aspx"
        "GEAR.WEAPONS.CATEGORY" -> "/Equipment.aspx?Category=37&Subcategory="
        "HAZARDS" -> "/Hazards.aspx?ID="
        "HAZARDS.WEATHER" -> "/WeatherHazards.aspx?ID="
        "HERITAGES" -> "/Heritages.aspx?ID="
        "KINGDOM.EVENTS" -> "/KMEvents.aspx?ID="
        "KINGDOM.STRUCTURES" -> "/KMStructures.aspx?ID="
        "LANGUAGES" -> "/Languages.aspx?ID="
        "MON.FAMILY" -> "/MonsterFamilies.aspx?ID="
        "MONSTERS" -> "/Monsters.aspx?ID="
        "PLANES" -> "/Planes.aspx?ID="
        "RELIC.GIFTS" -> "/Relics.aspx?ID="
        "RITUALS" -> "/Rituals.aspx?ID="
        "RULES" -> "/Rules.aspx?ID="
        "RUNES" -> "/Equipment.aspx?Category=23&Subcategory="
        "SHIELDS" -> "/Shields.aspx?ID="
        "SIEGE.WEAPONS" -> "/SiegeWeapons.aspx?ID="
        "SKILLS" -> "/Skills.aspx?ID="
        "SKILLS.GENERAL" -> "/Skills.aspx?General=true&ID="
        "SOURCES" -> "/Sources.aspx?ID="
        "SPELLS" -> "/Spells.aspx?ID="
        "TRADITIONS" -> "/Spells.aspx?Tradition="
        "TRAITS" -> "/Traits.aspx?ID="
        "UMR" -> "/MonsterAbilities.aspx?ID="
        "VEHICLES" -> "/Vehicles.aspx?ID="
        "WARFARE.TACTICS" -> "/KMWarTactics.aspx?ID="
        "WEAPON.GROUPS" -> "/WeaponGroups.aspx?ID="
        "WEAPONS" -> "/Weapons.aspx?ID="
        _ -> "/"


selectionDecoder : Decode.Decoder Selection
selectionDecoder =
    Field.require "text" Decode.string <| \text ->
    Field.require "start" Decode.int <| \start ->
    Field.require "end" Decode.int <| \end ->
    Decode.succeed
        { text = String.trim text
        , start = start + (String.toList text |> List.Extra.takeWhile ((==) ' ') |> List.length)
        , end = end - (String.toList text |> List.reverse |> List.Extra.takeWhile ((==) ' ') |> List.length)
        }


view : Model -> Html Msg
view model =
    Html.main_
        [ HA.class "column"
        , HA.class "gap-medium"
        ]
        [ Html.node "style"
            []
            [ Html.text css
            ]
        , viewOptions model
        , Html.div
            [ HA.class "row"
            , HA.class "gap-small"
            ]
            [ Html.textarea
                [ HA.id "text"
                , HA.style "flex" "1"
                , HA.value model.text
                , HA.style "width" "100%"
                , HA.style "height" "250px"
                , HE.onInput TextChanged
                , HE.onFocus (TextFocused True)
                , HE.onBlur (TextFocused False)
                ]
                []
            , viewPreview model
            ]
        , viewClipboard
        , viewUtilities
        , Html.div
            [ HA.class "row"
            , HA.class "gap-small"
            ]
            [ viewCandidates model
            , viewManual model
            ]
        ]


viewOptions : Model -> Html Msg
viewOptions model =
    Html.div
        [ HA.class "row"
        , HA.class "gap-medium"
        , HA.class "wrap"
        ]
        [ Html.div
            [ HA.class "row"
            , HA.class "gap-small"
            , HA.class "align-center"
            ]
            [ Html.text (String.fromInt (List.length model.documents) ++ " documents loaded")
            , Html.button
                [ HE.onClick RefreshDataPressed ]
                [ Html.text "Refresh" ]
            ]
        , Html.div
            [ HA.class "row"
            , HA.class "gap-tiny"
            , HA.class "align-center"
            ]
            [ Html.text "Elasticsearch URL"
            , Html.input
                [ HA.style "width" "300px"
                , HA.placeholder defaultElasticsearchUrl
                , HA.value model.elasticUrl
                , HE.onInput ElasticUrlChanged
                ]
                []
            ]
        , Html.div
            [ HA.class "row"
            , HA.class "gap-tiny"
            , HA.class "align-center"
            ]
            [ Html.text "AoN URL"
            , Html.input
                [ HA.style "width" "300px"
                , HA.placeholder defaultAonUrl
                , HA.value model.aonUrl
                , HE.onInput AonUrlChanged
                ]
                []
            ]
        ]


viewClipboard : Html Msg
viewClipboard =
    Html.div
        [ HA.class "row"
        , HA.class "gap-small"
        , HA.class "align-center"
        , HA.class "wrap"
        ]
        [ Html.text "Clipboard"
        , Html.button
            [ HE.onClick PasteFromClipboardPressed
            ]
            [ Html.text "Paste" ]
        , Html.button
            [ HE.onClick CopyToClipboardPressed
            ]
            [ Html.text "Copy" ]
        , Html.button
            [ HE.onClick CopyFirstSentenceToClipboardPressed
            ]
            [ Html.text "Copy first sentence" ]
        ]


viewUtilities : Html Msg
viewUtilities =
    Html.div
        [ HA.class "row"
        , HA.class "gap-small"
        , HA.class "align-center"
        , HA.class "wrap"
        ]
        [ Html.text "Utility"
        , Html.button
            [ HE.onClick FixNewlinesPressed
            , HA.title "Ctrl + Space"
            ]
            [ Html.text "Fix newlines" ]
        , Html.button
            [ HE.onClick AddBrPressed
            , HA.title "Ctrl + Enter"
            ]
            [ Html.text "Add <br />" ]
        , Html.button
            [ HE.onClick (WrapWithPressed "<b>" "</b>")
            , HA.title "Ctrl + B"
            ]
            [ Html.text "Wrap with <b>" ]
        , Html.button
            [ HE.onClick (WrapWithPressed "<i>" "</i>")
            , HA.title "Ctrl + I"
            ]
            [ Html.text "Wrap with <i>" ]
        , Html.button
            [ HE.onClick (WrapWithPressed "<u>" "</u>")
            , HA.title "Ctrl + U"
            ]
            [ Html.text "Wrap with <u>" ]
        , Html.button
            [ HE.onClick (WrapWithPressed "<h2 class=\"title\">" "</h2>")
            ]
            [ Html.text "Wrap with <h2 class=\"title\">" ]
        , Html.button
            [ HE.onClick ConvertToListPressed
            ]
            [ Html.text "Convert to <ul>" ]
        , Html.button
            [ HE.onClick ConvertActionsPressed
            ]
            [ Html.text "Convert actions" ]
        , Html.button
            [ HE.onClick FormatActionPressed
            ]
            [ Html.text "Format Action" ]
        , Html.button
            [ HE.onClick FormatCritEffectsPressed
            ]
            [ Html.text "Format CritEffects" ]
        , Html.button
            [ HE.onClick FormatTraitsPressed
            ]
            [ Html.text "Format Traits" ]
        ]


viewPreview : Model -> Html Msg
viewPreview model =
    Html.div
        [ HA.style "flex" "1"
        , HA.style "max-height" "250px"
        , HA.style "overflow-y" "auto"
        ]
        (model.text
            |> highlightCandidate model
            |> highlightSelection model
            |> viewMarkdown model
        )


highlightCandidate : Model -> String -> String
highlightCandidate model text =
    case model.currentCandidate of
        Just candidate ->
            let
                endIndex : Int
                endIndex =
                    candidate.index + String.length candidate.document.name
            in
            model.text
                |> String.Extra.replaceSlice
                    (String.join
                        ""
                        [ "<highlight-candidate>"
                        , String.slice candidate.index endIndex text
                        , "</highlight-candidate>"
                        ]
                    )
                    candidate.index
                    endIndex

        Nothing ->
            text


highlightSelection : Model -> String -> String
highlightSelection model text =
    if model.selection.start == model.selection.end then
        text

    else
        let
            -- ( Int, Int )
            ( start, end ) =
                case model.currentCandidate of
                    Just candidate ->
                        let
                            candidateEnd : Int
                            candidateEnd =
                                candidate.index + String.length candidate.document.name
                        in
                        ( model.selection.start
                        , if candidate.index >= model.selection.start
                            && candidateEnd <= model.selection.end
                          then
                            model.selection.end + (String.length "<highlight-candidate></highlight-candidate>")

                          else if candidate.index >= model.selection.start
                            && candidateEnd > model.selection.end
                          then
                            candidate.index + (String.length "<highlight-candidate>")

                          else
                            model.selection.end
                        )

                    Nothing ->
                        ( model.selection.start, model.selection.end )
        in
        String.Extra.replaceSlice
            (String.join
                ""
                [ "<highlight-selection>"
                , String.slice start end text
                    |> Regex.replace
                        (regexFromString "<.+?>")
                        (\match ->
                            "</highlight-selection>" ++ match.match ++ "<highlight-selection>"
                        )

                , "</highlight-selection>"
                ]
            )
            start
            end
            text


viewMarkdown : Model -> String -> List (Html Msg)
viewMarkdown model text =
    let
        markdown : Result (List String) (List Markdown.Block.Block)
        markdown =
            text
                |> String.replace " & " " &amp; "
                |> Regex.replace
                    (regexFromString "<%ACTION.TYPES#(.+?)%%>")
                    (\match ->
                        "<action id=\"" ++ getSubmatch 0 "" match ++ "\" />"
                    )
                |> Regex.replace
                    (regexFromString "<%([^%]+?)%([^%]+?)%%>(.+?)<%END>")
                    (\match ->
                        [ "<link code=\""
                        , getSubmatch 0 "" match
                        , "\" id=\""
                        , getSubmatch 1 "" match
                        , "\">"
                        , getSubmatch 2 "" match
                        , "</link>"
                        ]
                            |> String.join ""
                    )
                |> Regex.replace
                    (regexFromString "<%([^%]+?)%%>(.+?)<%END>")
                    (\match ->
                        [ "<link code=\""
                        , getSubmatch 0 "" match
                        , "\">"
                        , getSubmatch 1 "" match
                        , "</link>"
                        ]
                            |> String.join ""
                    )
                |> Markdown.Parser.parse
                |> Result.map (List.map (Markdown.Block.walk fixMarkdownSpacing))
                |> Result.mapError (List.map Markdown.Parser.deadEndToString)
    in
    case markdown of
        Ok blocks ->
            case Markdown.Renderer.render (markdownRenderer model) blocks of
                Ok v ->
                    List.concat v

                Err err ->
                    [ Html.div
                        [ HA.style "color" "red" ]
                        [ Html.text ("Error rendering markdown:") ]
                    , Html.div
                        [ HA.style "color" "red" ]
                        [ Html.text err ]
                    ]

        Err errors ->
            [ Html.div
                [ HA.style "color" "red" ]
                [ Html.text ("Error parsing markdown:") ]
            , Html.div
                [ HA.style "color" "red" ]
                (List.map Html.text errors)
            ]


getSubmatch : Int -> String -> Regex.Match -> String
getSubmatch index default match =
    match.submatches
        |> List.Extra.getAt index
        |> Maybe.Extra.join
        |> Maybe.withDefault default


fixMarkdownSpacing : Markdown.Block.Block -> Markdown.Block.Block
fixMarkdownSpacing block =
    mapHtmlElementChildren
        (List.foldl
            (\child previous ->
                case child of
                    Markdown.Block.Paragraph inlines ->
                        case List.Extra.last previous of
                            Just (Markdown.Block.HtmlBlock _) ->
                                List.append
                                    previous
                                    [ inlines
                                        |> List.map addSpaces
                                        |> Markdown.Block.Paragraph
                                    ]

                            _ ->
                                List.append previous [ child ]

                    _ ->
                        List.append previous [ child ]
            )
            []
        )
        block


mapHtmlElementChildren :
    (List (Markdown.Block.Block) -> List (Markdown.Block.Block))
    -> Markdown.Block.Block
    -> Markdown.Block.Block
mapHtmlElementChildren mapFun block =
    case block of
        Markdown.Block.HtmlBlock (Markdown.Block.HtmlElement name attrs children) ->
            Markdown.Block.HtmlBlock
                (Markdown.Block.HtmlElement
                    name
                    attrs
                    (mapFun children)
                )

        Markdown.Block.Paragraph inlines ->
            Markdown.Block.Paragraph
                (List.map
                    (\inline ->
                        case inline of
                            Markdown.Block.HtmlInline (Markdown.Block.HtmlElement name attrs children) ->
                                Markdown.Block.HtmlInline
                                    (Markdown.Block.HtmlElement
                                        name
                                        attrs
                                        (List.map fixMarkdownSpacing children)
                                    )

                            _ ->
                                inline
                    )
                    inlines
                )

        _ ->
            block


addSpaces : Markdown.Block.Inline -> Markdown.Block.Inline
addSpaces inline =
    case inline of
        Markdown.Block.Text text ->
            if Regex.contains (regexFromString "^[\\W].*") text then
                text ++ " "
                    |> Markdown.Block.Text

            else
                " " ++ text ++ " "
                    |> Markdown.Block.Text

        _ ->
            inline


markdownRenderer : Model -> Markdown.Renderer.Renderer (List (Html Msg))
markdownRenderer model =
    let
        defaultRenderer : Markdown.Renderer.Renderer (Html msg)
        defaultRenderer =
            Markdown.Renderer.defaultHtmlRenderer
    in
    { blockQuote = List.concat >> defaultRenderer.blockQuote >> List.singleton
    , codeBlock = defaultRenderer.codeBlock >> List.singleton
    , codeSpan = defaultRenderer.codeSpan >> List.singleton
    , emphasis = List.concat >> defaultRenderer.emphasis >> List.singleton
    , hardLineBreak = defaultRenderer.hardLineBreak |> List.singleton
    , heading =
        \heading ->
            [ defaultRenderer.heading
                { level = heading.level
                , rawText = heading.rawText
                , children = List.concat heading.children
                }
            ]
    , html = markdownHtmlRenderer model
    , image = defaultRenderer.image >> List.singleton
    , inlines = List.concat
    , link =
        \linkData ->
            List.concat >> defaultRenderer.link linkData >> List.singleton
    , orderedList = \startingIndex -> List.concat >> defaultRenderer.orderedList startingIndex >> List.singleton
    , paragraph = List.concat >> defaultRenderer.paragraph >> List.singleton
    , strikethrough = List.concat >> defaultRenderer.strikethrough >> List.singleton
    , strong = List.concat >> defaultRenderer.strong >> List.singleton
    , table = List.concat >> defaultRenderer.table >> List.singleton
    , tableBody = List.concat >> defaultRenderer.tableBody >> List.singleton
    , tableCell = \alignment -> List.concat >> defaultRenderer.tableCell alignment >> List.singleton
    , tableHeader = List.concat >> defaultRenderer.tableHeader >> List.singleton
    , tableHeaderCell = \alignment -> List.concat >> defaultRenderer.tableHeaderCell alignment >> List.singleton
    , tableRow = List.concat >> defaultRenderer.tableRow >> List.singleton
    , text = defaultRenderer.text >> List.singleton
    , thematicBreak = defaultRenderer.thematicBreak |> List.singleton
    , unorderedList =
        List.map
            (\item ->
                case item of
                    Markdown.Block.ListItem task children ->
                        Markdown.Block.ListItem task (List.concat children)
            )
            >> defaultRenderer.unorderedList
            >> List.singleton
    }


markdownHtmlRenderer : Model ->Markdown.Html.Renderer (List (List (Html Msg)) -> List (Html Msg))
markdownHtmlRenderer model =
    Markdown.Html.oneOf
        [ Markdown.Html.tag "action"
            (\id _ ->
                [ Html.span
                    [ HA.class "icon-font" ]
                    [ Html.text (actionIdToString id) ]
                ]
            )
            |> Markdown.Html.withAttribute "id"
        , Markdown.Html.tag "b"
            (\children ->
                [ Html.b
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "br"
            (\children ->
                [ Html.br
                    []
                    []
                ]
            )
        , Markdown.Html.tag "h2"
            (\class children ->
                [ Html.h2
                    [ HA.class (Maybe.withDefault "" class) ]
                    (List.concat children)
                ]
            )
            |> Markdown.Html.withOptionalAttribute "class"
        , Markdown.Html.tag "h3"
            (\class children ->
                [ Html.h3
                    [ HA.class (Maybe.withDefault "" class) ]
                    (List.concat children)
                ]
            )
            |> Markdown.Html.withOptionalAttribute "class"
        , Markdown.Html.tag "highlight-candidate"
            (\children ->
                [ Html.span
                    [ HA.class "highlight-candidate" ]
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "highlight-selection"
            (\children ->
                [ Html.span
                    [ HA.class "highlight-selection" ]
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "i"
            (\children ->
                [ Html.i
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "li"
            (\children ->
                [ Html.li
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "link"
            (\code maybeId children ->
                [ case maybeId of
                    Just id ->
                        Html.a
                            [ HA.href (model.aonUrl ++ linkCodeToUrl code ++ id)
                            , HA.style "text-decoration" "underline"
                            , HA.title ("<%" ++ code ++ "%" ++ id ++ "%%>")
                            ]
                            (List.concat children)

                    Nothing ->
                        Html.a
                            [ HA.href (model.aonUrl ++ linkCodeToUrl code)
                            , HA.style "text-decoration" "underline"
                            , HA.title ("<%" ++ code ++ "%%>")
                            ]
                            (List.concat children)
                ]
            )
            |> Markdown.Html.withAttribute "code"
            |> Markdown.Html.withOptionalAttribute "id"
        , Markdown.Html.tag "p"
            (\children ->
                [ Html.p
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "span"
            (\children ->
                [ Html.span
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "table"
            (\children ->
                [ Html.table
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "td"
            (\children ->
                [ Html.td
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "th"
            (\children ->
                [ Html.th
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "tr"
            (\children ->
                [ Html.tr
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "u"
            (\children ->
                [ Html.u
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "ol"
            (\children ->
                [ Html.ol
                    []
                    (List.concat children)
                ]
            )
        , Markdown.Html.tag "ul"
            (\children ->
                [ Html.ul
                    []
                    (List.concat children)
                ]
            )
        ]


actionIdToString : String -> String
actionIdToString id =
    case id of
        "2" ->
            "[one-action]"

        "3" ->
            "[two-actions]"

        "4" ->
            "[three-actions]"

        "5" ->
            "[reaction]"

        "6" ->
            "[free-action]"

        _ ->
            "[action-" ++ id ++ "]"


actionIdFromString : String -> String
actionIdFromString value =
    case value of
        "[one-action]" ->
            "2"

        "[two-actions]" ->
            "3"

        "[three-actions]" ->
            "4"

        "[reaction]" ->
            "5"

        "[free-action]" ->
            "5"

        _ ->
            "NULL"


viewCandidates : Model -> Html Msg
viewCandidates model =
    Html.div
        [ HA.class "column"
        , HA.class "gap-medium"
        , HA.style "max-height" "800px"
        , HA.style "overflow-y" "auto"
        , HA.style "flex" "1"
        ]
        (List.map
            (\(candidate, candidates) ->
                Html.div
                    [ HA.class "column"
                    , HA.class "gap-tiny"
                    ]
                    [ Html.div
                        [ HA.class "row"
                        , HA.class "gap-medium"
                        , HA.class "title"
                        , HA.style "margin-right" "4px"
                        ]
                        [ Html.text candidate.document.name
                        , Html.a
                            [ HA.href (model.aonUrl ++ candidate.document.url)
                            , HA.target "_blank"
                            ]
                            [ Html.text candidate.document.url ]
                        ]
                    , Html.div
                        [ HA.class "row"
                        , HA.class "gap-medium"
                        , HA.class "wrap"
                        ]
                        (List.map
                            (viewCandidate model)
                            (candidate :: candidates)
                        )
                    ]
            )
            (model.candidates
                |> List.Extra.gatherEqualsBy (.document >> .id)
            )
        )


viewCandidate : Model -> Candidate -> Html Msg
viewCandidate model candidate =
    Html.div
        [ HA.class "column"
        , HA.class "gap-tiny"
        , HA.style "border" "transparent 1px solid"
        , HA.style "padding" "4px"
        , HAE.attributeIf
            (model.currentCandidate == Just candidate)
            (HA.style "border" "white 1px solid")
        , HE.onMouseOver (CandidateSelected candidate)
        ]
        [ Html.div
            []
            [ Html.span
                [ HA.style "color" "#808080" ]
                [ if candidate.index < 10 then
                    Html.text ""

                  else
                    Html.text "..."
                , Html.text
                    (String.slice
                        (max 0 (candidate.index - 10))
                        (candidate.index)
                        model.text
                    )
                ]
            , Html.text
                (String.slice
                    (candidate.index)
                    (candidate.index + String.length candidate.document.name)
                    model.text
                )
            , Html.span
                [ HA.style "color" "#808080" ]
                [ Html.text
                    (String.slice
                        (candidate.index + String.length candidate.document.name)
                        (candidate.index + String.length candidate.document.name + 10)
                        model.text
                    )
                , if candidate.index + String.length candidate.document.name + 10 >= String.length model.text then
                    Html.text ""

                  else
                    Html.text "..."
                ]
            ]
        , Html.button
            [ HA.style "align-self" "flex-start"
            , HA.disabled (isCandidateInATag candidate model.text || String.contains (getDocumentLink candidate.document) model.text)
            , HE.onClick (ApplyCandidatePressed candidate)
            ]
            [ if String.contains (getDocumentLink candidate.document) model.text then
                Html.text "Applied"

              else if isCandidateInATag candidate model.text then
                Html.text "Already in a tag"

              else
                Html.text "Apply"
            ]
        ]


viewManual : Model -> Html Msg
viewManual model =
    Html.div
        [ HA.class "column"
        , HA.class "gap-small"
        , HA.style "flex" "1"
        ]
        [ Html.input
            [ HA.value model.manualSearch
            , HE.onInput ManualSearchChanged
            ]
            []
        , Html.div
            [ HA.class "column"
            , HA.class "gap-medium"
            , HA.style "max-height" "775px"
            , HA.style "overflow-y" "auto"
            ]
            (List.map
                (\document ->
                    let
                        candidate : Candidate
                        candidate =
                            { document = { document | name = model.selection.text }
                            , index = model.selection.start
                            }
                    in
                    Html.div
                        [ HA.class "column"
                        , HA.class "gap-tiny"
                        , HA.style "border" "transparent 1px solid"
                        , HA.style "padding" "4px"
                        , HAE.attributeIf
                            (model.currentCandidate == Just candidate)
                            (HA.style "border" "white 1px solid")
                        , HE.onMouseOver (CandidateSelected candidate)
                        ]
                        [ Html.div
                            [ HA.class "row"
                            , HA.class "gap-medium"
                            , HA.class "title"
                            ]
                            [ Html.text document.name
                            , Html.a
                                [ HA.href (model.aonUrl ++ document.url)
                                , HA.target "_blank"
                                ]
                                [ Html.text document.url ]
                            ]
                        , Html.button
                            [ HA.style "align-self" "flex-start"
                            , HA.disabled (isCandidateInATag candidate model.text || String.contains (getDocumentLink candidate.document) model.text)
                            , HE.onClick (ApplyCandidatePressed candidate)
                            ]
                            [ if String.contains (getDocumentLink candidate.document) model.text then
                                Html.text "Applied"

                              else if isCandidateInATag candidate model.text then
                                Html.text "Already in a tag"

                              else
                                Html.text "Apply"
                            ]
                        ]
                )
                (model.documents
                    |> List.filter
                        (\document ->
                            model.manualSearch /= ""
                                && String.contains (String.toLower model.manualSearch) (String.toLower document.name)
                        )
                    |> List.sortWith
                        (\a b ->
                            if String.toLower a.name == String.toLower model.manualSearch
                                && String.toLower b.name == String.toLower model.manualSearch
                            then
                                compare a.id b.id

                            else if String.toLower a.name == String.toLower model.manualSearch then
                                LT

                            else if String.toLower b.name == String.toLower model.manualSearch then
                                GT

                            else
                                compare a.id b.id
                        )
                    |> List.take 20
                )
            )
        ]


css : String
css =
    """
    body {
        background-color: #0f0f0f;
        margin: 8px;
        color: #eeeeee;
    }

    a {
        color: inherit;
    }

    a p, b p, i p, u p, li p, span p {
        display: inline;
    }

    p {
        margin: 0;
    }

    .row {
        display: flex;
        flex-direction: row;
    }

    .column {
        display: flex;
        flex-direction: column;
    }

    .gap-large {
        gap: 20px;
    }

    .gap-medium {
        gap: 12px;
    }

    .gap-medium.row, .gap-large.row {
        row-gap: var(--gap-tiny);
    }

    .gap-small {
        gap: 8px;
    }

    .gap-tiny {
        gap: 4px;
    }

    .align-center {
        align-items: center;
    }

    .wrap {
        flex-wrap: wrap;
    }

    .title {
        background-color: #522e2c;
        border-radius: 2px;
        color: #cbc18f;
        padding: 2px 4px;
    }

    h2 {
        margin: 8px 0;
    }

    h2.title {
        background-color: #806e45;
        color: #0f0f0f;
    }

    .highlight-candidate, .highlight-candidate .highlight-selection {
        color: #ff00ff;
    }

    .highlight-selection {
        color: #00ffff;
    }

    .icon-font {
        font-family: "Pathfinder-Icons";
        font-variant-caps: normal;
        font-weight: normal;
        vertical-align: text-bottom;
    }

    @font-face {
        font-family: "Pathfinder-Icons";
        src: url("Pathfinder-Icons.ttf");
        font-display: swap;
    }
    """
