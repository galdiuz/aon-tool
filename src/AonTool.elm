port module AonTool exposing (main)

import Browser
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
import Maybe.Extra
import Process
import Regex
import String.Extra
import Task


port clipboard_get : () -> Cmd msg
port clipboard_receive : (String -> msg) -> Sub msg
port clipboard_set : String -> Cmd msg
port localStorage_set : Encode.Value -> Cmd msg
port selectionChanged : (Decode.Value -> msg) -> Sub msg


type alias Model =
    { candidates : List Candidate
    , currentCandidate : Maybe Candidate
    , debounce : Int
    , documents : List Document
    , elasticUrl : String
    , manualSearch : String
    , selection : Selection
    , text : String
    }


type Msg
    = AddBrPressed
    | ApplyCandidatePressed Candidate
    | CandidateSelected Candidate
    | CopyToClipboardPressed
    | CopyFirstSentenceToClipboardPressed
    | DebouncePassed Int
    | FixNewlinesPressed
    | GotClipboardContents String
    | GotDataResult (Result Http.Error SearchResult)
    | ManualSearchChanged String
    | PasteFromClipboardPressed
    | RefreshDataPressed
    | SelectionChanged Decode.Value
    | TextChanged String


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
    ( { candidates = []
      , currentCandidate = Nothing
      , debounce = 0
      , documents = []
      , elasticUrl = "https://elasticsearch.aonprd.com/aon"
      , manualSearch = ""
      , selection = emptySelection
      , text = ""
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
        , selectionChanged SelectionChanged
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        AddBrPressed ->
            ( { model
                | text =
                    String.Extra.insertAt "<br />" model.selection.start model.text
              }
            , Cmd.none
            )
                |> updateCandidates

        ApplyCandidatePressed candidate ->
            ( { model
                | text =
                    applyCandidate candidate model.text
              }
            , Cmd.none
            )
                |> updateCandidates

        CandidateSelected candidate ->
            ( { model | currentCandidate = Just candidate }
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

        FixNewlinesPressed ->
            let
                lines : List String
                lines =
                    model.text
                        |> String.replace "\r" ""
                        |> String.split "\n"

                median : Int
                median =
                    lines
                        |> List.map String.length
                        |> List.Extra.getAt (List.length lines // 2)
                        |> Maybe.withDefault 0

                fixed : String
                fixed =
                    lines
                        |> List.filter ((/=) "")
                        |> List.Extra.groupWhile
                            (\a b ->
                                String.length a > median - 10
                            )
                        |> List.map
                            (\( first, rest ) ->
                                first ++ " " ++ String.join " " rest
                            )
                        |> String.join "<br /><br />"
            in
            ( { model | text = fixed }
            , Cmd.none
            )
                |> updateCandidates

        GotClipboardContents value ->
            ( { model | text = value }
            , Cmd.none
            )
                |> updateCandidates

        GotDataResult result ->
            case result of
                Ok searchResult ->
                    ( { model
                        | documents =
                            List.append model.documents searchResult.documents
                      }
                    , Cmd.none
                    )
                        |> (if List.length searchResult.documents < dataSize then
                                (\(m, cmd) ->
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
                , manualSearch = String.trim selection.text
                , selection = selection
              }
            , Process.sleep 250
                |> Task.perform (\_ -> DebouncePassed (model.debounce + 1))
            )

        TextChanged text ->
            ( { model
                | debounce = model.debounce + 1
                , selection = emptySelection
                , text = text
              }
            , Process.sleep 250
                |> Task.perform (\_ -> DebouncePassed (model.debounce + 1))
            )


flagsDecoder : Decode.Decoder Flags
flagsDecoder =
    Field.attempt "localStorage" (Decode.dict Decode.string) <| \localStorage ->
    Decode.succeed
        { localStorage = Maybe.withDefault defaultFlags.localStorage localStorage
        }


updateModelFromLocalStorage : ( String, String ) -> Model -> Model
updateModelFromLocalStorage ( key, value ) model =
    case key of
        "data" ->
            case Decode.decodeString (Decode.list documentDecoder) value of
                Ok documents ->
                    { model | documents = documents }

                Err _ ->
                    model

        _ ->
            model


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
                                        -- [ ( "query", Encode.string "type: (action OR feat OR spell OR trait)" )
                                        [ ( "query", Encode.string "*" )
                                        , ( "default_operator", Encode.string "AND" )
                                        -- , ( "fields", Encode.list Encode.string [ "name" ] )
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
                            && not (List.member document.category [ "category-page", "class-feature" ])
                            && not (document.category == "rules"
                                && List.member
                                    document.name
                                    [ "Attack"
                                    , "Bulk"
                                    , "Effect"
                                    , "Effects"
                                    , "Example"
                                    , "Level"
                                    , "Skill"
                                    , "Speed"
                                    , "Spell"
                                    , "Spells"
                                    , "Trait"
                                    , "Weapons"
                                    ]
                                )
                    )
                |> List.concatMap
                    (\document ->
                        Regex.find
                            (regexFromString ("(?<![a-zA-Z%])" ++ document.name ++ "(?![a-zA-Z%])"))
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
        , currentCandidate = List.head candidates
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


applyCandidate : Candidate -> String -> String
applyCandidate candidate text =
    Regex.replace
        (regexFromString candidate.document.name)
        (\match ->
            if match.index == candidate.index then
                addLinkTag candidate.document match.match

            else
                match.match
        )
        text


isCandidateInATag : Candidate -> String -> Bool
isCandidateInATag candidate text =
    let
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
        , Html.div
            [ HA.class "row"
            , HA.class "gap-small"
            ]
            [ Html.text (String.fromInt (List.length model.documents) ++ " documents loaded")
            , Html.button
                [ HE.onClick RefreshDataPressed ]
                [ Html.text "Refresh" ]
            ]
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
                ]
                []
            , viewPreview model
            ]
        , Html.div
            [ HA.class "row"
            , HA.class "gap-small"
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
        , Html.div
            [ HA.class "row"
            , HA.class "gap-small"
            ]
            [ Html.text "Utility"
            , Html.button
                [ HE.onClick FixNewlinesPressed
                ]
                [ Html.text "Fix newlines" ]
            , Html.button
                [ HE.onClick AddBrPressed
                ]
                [ Html.text "Add <br />" ]
            ]
        , Html.div
            [ HA.class "row"
            , HA.class "gap-small"
            ]
            [ viewCandidates model
            , viewManual model
            ]
        ]


viewPreview : Model -> Html msg
viewPreview model =
    Html.div
        [ HA.style "flex" "1"
        ]
        (case model.currentCandidate of
            Just candidate ->
                if isCandidateInATag candidate model.text then
                    [ viewTextWithBr
                        (String.left
                            candidate.index
                            model.text
                        )
                    , Html.span
                        [ HA.style "color" "#ff00ff" ]
                        [ Html.text
                            (model.text
                                |> String.dropLeft (candidate.index)
                                |> String.left (String.length candidate.document.name)
                            )
                        ]
                    , viewTextWithBr
                        (String.dropLeft
                            (candidate.index + String.length candidate.document.name)
                            model.text
                        )
                    ]

                else
                    [ viewTextWithBr
                        (String.left
                            candidate.index
                            model.text
                        )
                    , Html.span
                        [ HA.style "color" "#00ffff" ]
                        [ Html.text (getDocumentLink candidate.document) ]
                    , Html.span
                        [ HA.style "color" "#ff00ff" ]
                        [ viewTextWithBr
                            (model.text
                                |> String.dropLeft (candidate.index)
                                |> String.left (String.length candidate.document.name)
                            )
                        ]
                    , Html.span
                        [ HA.style "color" "#00ffff" ]
                        [ Html.text "<%END>" ]
                    , viewTextWithBr
                        (String.dropLeft
                            (candidate.index + String.length candidate.document.name)
                            model.text
                        )
                    ]

            Nothing ->
                [ viewTextWithBr model.text
                ]
        )


viewTextWithBr text =
    Html.span
        []
        (String.split "<br />" text
            |> List.map Html.text
            |> List.intersperse (Html.br [] [])
        )


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
                            [ HA.href ("https://2e.aonprd.com" ++ candidate.document.url)
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
                , if candidate.index + 10 >= String.length model.text then
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
                                [ HA.href ("https://2e.aonprd.com" ++ document.url)
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

    .wrap {
        flex-wrap: wrap;
    }

    .title {
        background-color: #522e2c;
        border-radius: 2px;
        color: #cbc18f;
        padding: 2px 4px;
    }
    """