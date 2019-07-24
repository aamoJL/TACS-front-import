*** Settings ***
Documentation       A resource file with reusable keywords and variables.
Library     SeleniumLibrary    run_on_failure=nothing
Library     String
Library     DateTime
Library    Collections

*** Variables ***
${SERVER}           %{SITE_URL}
${BROWSER}          ff
${DELAY}            0.5
#${VALID USER} =     ville
${VALID PASSWORD} =     koira
${LOGIN URL}        https://${SERVER}/
${WELCOME URL}      #You can use this if there's a different page after login page.
${LOC_USER}         id=registerUsernameInput            #Generated username.
${LOC_PASSWORD}     id=registerPasswordInput            #Generated password first time.
${LOC_PASSWORD2}    id=registerPasswordVerifyInput      #Generated password verify.
${ZOOMIN}           css=a[class=leaflet-control-zoom-in]        #Zoom in button location
${ZOOMOUT}          css=a[class=leaflet-control-zoom-out]        #Zoom out button location
${INVALID_U}        User does not exist
${INVALID_P}        Invalid password
${SHORT_P}          Validation failed: password must be longer than or equal to 3 characters
${SHORT_U}          Validation failed: name must be longer than or equal to 3 characters
${SHORT_UP}         Validation failed: name must be longer than or equal to 3 characters, password must be longer than or equal to 3 characters
${LONG_U}           Validation failed: name must be shorter than or equal to 31 characters
${LONG_P}           Validation failed: password must be shorter than or equal to 255 characters
${LONG_UP}          Validation failed: name must be shorter than or equal to 31 characters, password must be shorter than or equal to 255 characters
${SU_LP}            Validation failed: name must be longer than or equal to 3 characters, password must be shorter than or equal to 255 characters
${LU_SP}            Validation failed: name must be shorter than or equal to 31 characters, password must be longer than or equal to 3 characters
${ACC_EXISTS}       User already exists
${P_NOMATCH}        Passwords do not match

## New Game /
# B = Button / I = Input
${B_NEWGAME}        id=newGameButton
${B_EDITGAME}       id=editGameButton
${I_NGAMENAME}      id=newGameNameInput
${I_NGAMEDESC}      id=newGameDescriptionInput
${I_NGAMESTART}     id=newGameDateStartInput

${I_NSTARTTIME}     id=newGameTimeStartInput
${I_NGAMESTOP}      id=newGameDateEndInput
${I_NSTOPTIME}      id=newGameTimeEndInput
${B_NSUBMIT}        id=newGameSubmitButton

${L_GAMELIST}       id=changeActiveGameList
${START}

## Edit Game
${I_EGAMENAME}      id=editGameNameInput
${I_EGAMEDESC}      id=editGameDescriptionInput
${I_EGAMESTART}     id=editGameDateStartInput
${I_ESTARTTIME}     id=editGameTimeStartInput

${I_EGAMESTOP}      id=editGameDateEndInput
${I_ESTOPTIME}      id=editGameTimeEndInput
${I_FACTIONNAME}    id=editGameFactionNameInput
${I_FACTIONPASS}    id=editGameFactionPasswordInput
${B_FACTIONADD}     id=editGameFactionSubmitButton

${I_FLAGNAME}       id=editGameObjectivePointDescriptionInput
${I_FLAGMULTI}      id=editGameObjectivePointMultiplierInput
${B_FLAGADD}        id=editGameObjectivePointSubmitButton
${I_CAPTURE}        id=editGameCaptureTimeInput
${I_CONF}           id=editGameConfirmationTimeInput


${B_ESUBMIT}        id=editGameSubmitButton
${B_EDELETE}        id=editGameDeleteGameButton
${E_ECLOSE}         id=closeEditGameFormX
${FACTION1}         Faction1
${FACTION2}         Faction2
${ALLFACTIONS}      Every faction

## Game List
${B_GAMESELECT}     id=selectGameButton
${testit}           css=button[id^="selecttest_"]


## Join Game
${B_JOINGAME}       id=joinGameButton
${L_SELECTFACTION}  id=selectFactionList
${I_JOINPASS}       id=factionPasswordInput
${B_JOINSUBMIT}     id=joinGameSubmitButton

## Promote
${B_SHOWPLAYERS}    id=showPlayersButton
*** Keywords ***

#Valid Login
Open Browser To Login Page
    Open Browser        ${LOGIN URL}      ${BROWSER}
    Set Window Size     1920        1080
    Set Selenium Speed      ${DELAY}
    Login Page Should be Open

Login Page Should be Open
    Title Should Be     TACS

Go To Login Page
    Go To       ${LOGIN URL}
    Login Page Should be Open

Open Login      #No need anymore since the new website.
    Click Button       id=loginButton

Input Username
    [Arguments]     ${username}
    Input Text      id=loginUsernameInput      ${username}

Input Password
    [Arguments]     ${password}
    Input Text      id=loginPasswordInput        ${password}

Submit Credentials Login
    Click Button        id=submitLoginButton

Welcome Page Should Be Open     #You can use this if there's a different page after login page.
    Location Should Be      ${WELCOME URL}

Log Out
    Click Button        id=signOutButton

Close Login Screen
    Click Element        id=closeLoginFormX

Wait For Log Out Button To Appear       #not in use
    Wait Until Page Contains Element        id=logoutButton      1



#Registration
Open Registration
    Click Button        id=loginRegisterButton

Generate Valid Username     #Generates new username for every test rotation in gitlab. Used in test suite 00.
    ${GENE_username} =      Generate Random String      12       [LETTERS][NUMBERS]
    Set Global Variable    ${VALID USER}    ${GENE_username}

Input Valid Username        #Inputs the generated valid username for login. (Test suite 00)
    Input Text      ${LOC_USER}        ${VALID USER}

Input Valid Password        #Inputs the valid password: ville. (Test suite 00 and 01)
    Input Text      ${LOC_PASSWORD}        ${VALID PASSWORD}
    Input Text      ${LOC_PASSWORD2}        ${VALID PASSWORD}

Generate Username       #Generates a random username        lenght=8     chars=[LETTERS][NUMBERS]
    [Arguments]     ${GNUM_U}
    ${GENE_username} =   Generate Random String      ${GNUM_U}       [LETTERS][NUMBERS]
    Input Text      ${LOC_USER}        ${GENE_username}

Generate Password       #Generates a random password        lenght=8     chars=[LETTERS][NUMBERS]
    [Arguments]     ${GNUM_P}
    ${GENE_password} =   Generate Random String      ${GNUM_P}       [LETTERS][NUMBERS]
    Input Text      ${LOC_PASSWORD}        ${GENE_password}
    Input Text      ${LOC_PASSWORD2}        ${GENE_password}

Generate Differing Password
    [Arguments]     ${GNUM_VP}
    ${GENE_dpassword} =     Generate Random String      ${GNUM_VP}      [LETTERS][NUMBERS]
    ${GENE_dpassword2} =     Generate Random String      ${GNUM_VP}      [LETTERS][NUMBERS]
    Input Text      ${LOC_PASSWORD}      ${GENE_dpassword}
    Input Text      ${LOC_PASSWORD2}      ${GENE_dpassword2}

Submit Credentials Registration
    Click Button        id=submitRegisterButton

Close Registration Screen       #not in use
    Click Element       id=closeRegisterFormX

Back To Login Screen
    Click Element       id=openLoginFormButton



#Zoom frontpage
Zoom In On Frontpage
    Repeat Keyword          3 times         Click Element      ${ZOOMIN}


Zoom Out On Frontpage
    Repeat Keyword          3 times         Click Element       ${ZOOMOUT}



#Drawing tools and map movement frontpage
Drawing A Figure
    [Arguments]     ${X}        ${Y}
    Click Element At Coordinates    css=div[class=leaflet-control-container]        ${X}        ${Y}

Click Leaflet Panel
    [Arguments]     ${TARGET}
    Click Element      css=a[title="${TARGET}"]

Draw A Polyline
    Click Element       css=a[class=leaflet-draw-draw-polyline]
    Drawing A Figure        500     500
    Drawing A Figure        300     500
    Drawing A Figure        300     300
    Drawing A Figure        500     300
    Drawing A Figure        500     500
    Click Leaflet Panel     Delete last point drawn
    Drawing A Figure        500     500
    Drawing A Figure        500     500
    Drawing A Figure        550     300
    Drawing A Figure        550     500
    Click Leaflet Panel     Finish drawing
    Drawing A Figure        600     300
    Drawing A Figure        600     500
    Click Leaflet Panel     Cancel drawing
    Log To Console          \n.Polyline done

Draw A Polygon
    Click Element     css=a[class=leaflet-draw-draw-polygon]
    Drawing A Figure        50      300
    Drawing A Figure        -100    300
    Drawing A Figure        -60     100
    Click Leaflet Panel     Cancel drawing
    Click Element     css=a[class=leaflet-draw-draw-polygon]
    Drawing A Figure        50      300
    Drawing A Figure        -100    300
    Drawing A Figure        -60     100
    Click Leaflet Panel     Delete last point drawn
    Drawing A Figure        -60     100
    Click Leaflet Panel     Finish drawing
    Drawing A Figure        -120    300
    Drawing A Figure        -180    300
    Drawing A Figure        -110    100
    Drawing A Figure        -120    300
    Log To Console          Polygon done

Draw A Rectangle
    Click Element       css=a[class=leaflet-draw-draw-rectangle]
    Drawing A Figure        -200     100
    Drawing A Figure        -0       500
    #Click Leaflet Panel     Cancel drawing
    Log To Console          Rectangle done

Draw A Circle
    Click Element       css=a[class=leaflet-draw-draw-circle]
    Mouse Down          class:leaflet-tile-loaded:nth-child(2)
    Mouse Up            class:leaflet-tile-loaded:nth-child(5)
    #Click Leaflet Panel     Cancel drawing
    Log To Console          Circle done

Draw A Marker
    Click Element       css=a[class=leaflet-draw-draw-marker]
    Drawing A Figure        200     200
    Click Element       css=a[class=leaflet-draw-draw-marker]
    Drawing A Figure        300     300
    #Click Leaflet Panel     Cancel drawing
    Log To Console          Markers done

Edit Layers
    Click Element   css=a[class=leaflet-draw-edit-edit]
    Mouse Down      class:leaflet-editing-icon:first-of-type            #Polyline
    Mouse Up        class:leaflet-tile-loaded:nth-child(2)              #Polyline
    Mouse Down      class:leaflet-editing-icon:nth-last-of-type(7)      #Rectangle
    Mouse Up        class:leaflet-tile-loaded:nth-child(4)              #Rectangle
    Mouse Down      class:leaflet-editing-icon:nth-last-of-type(6)      #Rectangle
    Mouse Up        class:leaflet-tile-loaded:nth-child(5)              #Rectangle
    Mouse Down      class:leaflet-editing-icon:nth-last-of-type(8)      #Polygon
    Mouse Up        class:leaflet-tile-loaded:nth-child(2)              #Polygon
    Mouse Down      class:leaflet-editing-icon:nth-last-of-type(3)      #Circle
    Mouse Up        class:leaflet-tile-loaded:nth-child(4)              #Circle
    Mouse Down      class:leaflet-editing-icon:nth-last-of-type(4)      #Circle
    Mouse Up        class:leaflet-tile-loaded:nth-child(3)              #Circle
    Mouse Down      class:leaflet-marker-icon:last-of-type              #Marker
    Mouse Up        class:leaflet-tile-loaded:nth-child(12)             #Marker
    Click Leaflet Panel     Save changes
    Click Element   css=a[class=leaflet-draw-edit-edit]
    Mouse Down      class:leaflet-marker-icon:nth-last-of-type(2)       #Marker
    Mouse Up        class:leaflet-tile-loaded:nth-child(3)              #Marker
    Click Leaflet Panel     Cancel editing, discards all changes
    Log To Console          Editing done

Delete Layers
    Click Element       css=a[class=leaflet-draw-edit-remove]
    Click Element       class:leaflet-marker-icon:nth-last-of-type(2)       #Marker
    Click Leaflet Panel     Save changes
    Click Element       css=a[class=leaflet-draw-edit-remove]
    Click Element At Coordinates    css=div[class=leaflet-control-container]        50        300
    Click Leaflet Panel     Cancel editing, discards all changes
    Click Element       css=a[class=leaflet-draw-edit-remove]
    Click Element       css=a[title="Clear all layers"]
    Log To Console      Deleting done

Map Movement
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     10     100
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     50     300
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     800     800
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     -50     -50
    Log To Console             Map movement tested

# Leaflet write text

Write Text
#    Select Game
    Click Element       css=a[class=leaflet-draw-draw-textbox]
    Click Element At Coordinates    css=div[class=leaflet-control-container]        100        300
    Input Text      css=div[placeholder="Click out to save"]        Hello
    Click Element At Coordinates    css=div[class=leaflet-control-container]        100        400
    Element Text Should Be      css=div[placeholder="Click out to save"]        Hello       #Tarkistaa onko teksti oikein.
    Sleep       2

    Click Element       css=a[class=leaflet-draw-draw-textbox]
    Click Element At Coordinates    css=div[class=leaflet-control-container]        100        500
    Sleep       4
    Input Text      css=div[placeholder="Click out to save"]       12345
    Click Element At Coordinates    css=div[class=leaflet-control-container]        100        400
    Element Text Should Be      css=div[placeholder="Click out to save"]        12345
    :FOR        ${i}        IN RANGE        1000
    \       ${status}       ${value} =  Run Keyword And Ignore Error    Page Should Contain Element     id={i}
    \       Run Keyword if      '${status}'=='PASS'     Log     {i}
#    :FOR    ${i}        IN RANGE        1000
#    \       Run Keyword if      'id={i}'=='PASS'
#    \       Run Keyword if       '{i}'=='5'        Log     ${i}
#    Click Element       css=a[class=leaflet-draw-edit-edit]
#    Mouse Down      class:leaflet-marker-icon:first-of-type
#    Sleep       2
#    Mouse Up        class:leaflet-tile-loaded:nth-child(4)
#    Sleep       2
#    Click Leaflet Panel     Save changes
#    Sleep       2
#    Click Element       css=a[class=leaflet-draw-edit-edit]
#    Mouse Down      class:leaflet-marker-icon:first-of-type
#    Mouse Up        class:leaflet-tile-loaded:nth-child(1)
#    Sleep       2
#    Click Leaflet Panel     Cancel editing, discards all changes
#    Sleep       2

# ------------------------------------------------------------------------------

# Adding New Task / 09_tasks

Click Tasks
    Click Element       id=tasklistButton

Generate Task Name/Description
    [Arguments]     ${TASK_NAME}      ${TASK_DESCRIPTION}
    ${TASK_N} =     Generate Random String      ${TASK_NAME}            [LETTERS][NUMBERS]
    ${TASK_D} =     Generate Random String      ${TASK_DESCRIPTION}     [LETTERS][NUMBERS]
    Input Text      id=taskNameInput            ${TASK_N}
    Input Text      id=taskDescriptionInput     ${TASK_D}

Create Task List
    @{task_list} =        Create List
    Set Global Variable     @{TASK_NAMES}      @{task_list}

Generate Task Name
    [Arguments]     ${TASK_NAME}
    ${TASK_N} =     Generate Random String      ${TASK_NAME}            [LETTERS][NUMBERS]
    Input Text      id=taskNameInput            ${TASK_N}
    Append To List      ${TASK_NAMES}      ${TASK_N}
    Log     ${TASK_NAMES}
    [Return]        ${TASK_NAMES}

Generate Task Description
    [Arguments]     ${TASK_DESCRIPTION}
    ${TASK_D} =     Generate Random String      ${TASK_DESCRIPTION}     [LETTERS][NUMBERS]
    Input Text      id=taskDescriptionInput     ${TASK_D}

Submit Task
    Click Element       id=newTaskSubmitButton

#Wait For Game Select Button To Appear
#    Wait Until Page Contains Element        id=     1

Select Faction
    [Arguments]     ${faction}
    Select From List By Label     id=taskFactionSelect      ${faction}

#
# 10_tasks_edit
#

Task Winner Select
    ${game_name} =      Catenate        SEPARATOR=      id=taskEditButton       @{TASK_NAMES}[0]
    ${winner} =         Catenate        SEPARATOR=      id=taskWinnerSelect     @{TASK_NAMES}[0]
    ${save_winner} =    Catenate        SEPARATOR=      id=taskSaveButton       @{TASK_NAMES}[0]
    Click Tasks
    Click Button       ${game_name}
    Click Button       ${game_name}
    Click Button       ${game_name}
    Select From List By Label       ${winner}       ${FACTION2}
    Click Button        ${save_winner}
    Alert Should Be Present     text=Task updated and closed     action=ACCEPT       timeout=None

Delete Task
    ${delete_game} =    Catenate      SEPARATOR=      id=taskDeleteButton       @{TASK_NAMES}[1]
    Click Button       ${delete_game}
    Handle Alert        action=DISMISS      #Chooses "Cancel" on the popup.
    Click Button       ${delete_game}
    Alert Should Be Present     text=Are you sure you want to delete task "@{TASK_NAMES}[1]"    action=ACCEPT       timeout=None
    Alert Should Be Present     text=Task deleted       action=ACCEPT       timeout=None

Delete Completed Task
    ${delete_game} =    Catenate      SEPARATOR=      id=taskDeleteButton       @{TASK_NAMES}[0]
    Click Button        ${delete_game}
    Alert Should Be Present     text=Are you sure you want to delete task "@{TASK_NAMES}[0]"    action=ACCEPT       timeout=None
    Alert Should Be Present     text=Task deleted       action=ACCEPT       timeout=None





#
#   New Game
#   Valid name 3-30 / Desc 1 - 255
#${B_NEWGAME}        id=newGameButton
#${I_NGAMENAME}      id=newGameNameInput
#${I_NGAMEDESC}      id=newGameDescriptionInput
#${I_NGAMESTART}     id=newGameDateStartInput
#${I_NSTARTTIME}     id=newGameTimeStartInput
#${I_NGAMESTOP}      id=newGameDateEndInput
#${I_NSTOPTIME}      id=newGameTimeEndInput
#${B_NSUBMIT}        id=newGameSubmitButton
#${L_GAMELIST}       id=changeActiveGameList
#${START}

### Edit Game
#${B_EDITGAME}       id=editGameButton
#${I_EGAMENAME}      id=editGameNameInput
#${I_EGAMEDESC}      id=editGameDescriptionInput
#${I_EGAMESTART}     id=editGameDateStartInput
#${I_ESTARTTIME}     id=editGameTimeStartInput
#${I_EGAMESTOP}      id=editGameDateEndInput
#${I_ESTOPTIME}      id=editGameTimeEndInput
#${B_ESUBMIT}        id=editGameSubmitButton

#${I_FACTIONNAME}    id=factionNameInput
#${I_FACTIONPASS}    id=factionPasswordInput
#${B_FACTIONADD}     id=factionAddButton
#
#${I_FLAGNAME}       id=objectivePointDescriptionInput
#${I_FLAGMULTI}      id=objectivePointMultiplierInput
#${B_FLAGADD}        id=objectivePointAddButton
#${I_CAPTURE}        id=captureTimeInput
#${I_CONF}           id=confirmationTimeInput

Create Game
    Wait Until Page Contains Element        id=newGameButton      1
    Generate Valid Gamename
    Click Button    ${B_NEWGAME}
    Input Text      ${I_NGAMENAME}   ${VALID_GAME}
    Log             GameName set
    Input Text      ${I_NGAMEDESC}   Hello! ~RobotFramework
    Log             Desc set

    # Set Game start time
    Generate Game Start Date And Time   # Generate globals: STARTDATE, STARTTIME
    Input Text      ${I_NGAMESTART}  ${STARTDATE}
    Input Text      ${I_NSTARTTIME}  ${STARTTIME}
    Log             start datetime ok

    # Set Game end time
    Generate Game End Date And Time     # Generate globals: ENDDATE, ENDTIME
    Input Text      ${I_NGAMESTOP}   ${ENDDATE}
    Input Text      ${I_NSTOPTIME}   ${ENDTIME}
    Log             end datetime ok

    Click Button    ${B_NSUBMIT}
    Handle Alert

Select Game
    ${x} =              Format String           select{}     ${VALID_GAME}
    Wait Until Page Contains Element        id=${x}     1
    Click Button        id=${x}
    Log                 Game Selected

Edit Game Time
    Wait Until Page Contains Element        id=editGameButton      1
    Click Button    ${B_EDITGAME}
    Input Text      ${I_EGAMENAME}   ${VALID_GAME}  #test_bINk5V
    Log             GameName edited
    Input Text      ${I_EGAMEDESC}   Hello, I Edited this game ~RobotFramework
    Log             Desc edited

    # Set Game start time
    Generate Game Start Date And Time
    Input Text      ${I_EGAMESTART}  ${STARTDATE}
    Input Text      ${I_ESTARTTIME}  ${STARTTIME}
    Log             start edited

    # Set Game end time
    Generate Game End Date And Time
    Input Text      ${I_EGAMESTOP}   ${ENDDATE}
    Input Text      ${I_ESTOPTIME}   ${ENDTIME}
    Log             end edited

Edit Factions
    Input Text      ${I_FACTIONNAME}    ${FACTION1}
    Input Text      ${I_FACTIONPASS}    Pass1
    Click Button    ${B_FACTIONADD}

    Input Text      ${I_FACTIONNAME}    ${FACTION2}
    Input Text      ${I_FACTIONPASS}    Pass2
    Click Button    ${B_FACTIONADD}

Edit Objective Points
    Input Text      ${I_FLAGNAME}       1234567
    Input Text      ${I_FLAGMULTI}      3
    Click Button    ${B_FLAGADD}

#    Input Text      ${I_CAPTURE}        240
#    Input Text      ${I_CONF}           30

Save Game
    # Joku vika
    #Press Keys          None    PAGE_DOWN
    #Submit Form

    Click Button        ${B_ESUBMIT}
    Alert Should Be Present     text=Game updated     action=ACCEPT       timeout=None


Generate Valid Gamename     #Generates new name for every test rotation in gitlab. Used in test suite xx.
    ${g_name} =     Generate Random String      6       [LETTERS][NUMBERS]
    ${x} =          Format String           test_{}     ${g_name}
    Set Global Variable     ${VALID_GAME}    ${x}

Randint
    [Arguments]     ${x}    ${y}
    ${random} =     Evaluate    random.randint(${x}, ${y})  modules=random
    [Return]        ${random}

Generate Game Start Date And Time
    ${datetime} =   Get Current Date    result_format=%Y-%m-%d %H:%M

    ${random} =     Randint     1   365
    ${startdate} =  Add Time To Date    ${datetime}   ${random} days

    ${random} =     Randint     0   1339
    ${startdate} =  Add Time To Date    ${startdate}  ${random} minutes

    ${startdate} =          Convert Date    ${startdate}   result_format=%Y-%m-%d %H:%M
    ${date}  ${time} =      Split String    ${startdate}
    Set Global Variable     ${START}        ${startdate}
    Set Global Variable     ${STARTDATE}    ${date}
    Set Global Variable     ${STARTTIME}    ${time}


Generate Game End Date And Time
    ${datetime} =   Set Variable  ${START}

    ${random} =     Randint     1   365
    ${enddate} =    Add Time To Date    ${datetime}  ${random} days

    ${random} =     Randint     0   1339
    ${enddate} =    Add Time To Date    ${enddate}   ${random} minutes

    ${enddate} =    Convert Date        ${enddate}   result_format=%Y-%m-%d %H:%M
    ${date}  ${time} =      Split String  ${enddate}

    Set Global Variable     ${END}        ${enddate}
    Set Global Variable     ${ENDDATE}    ${date}
    Set Global Variable     ${ENDTIME}    ${time}


#
# JOIN GAME AND FACTION
# PROMOTE
#

#Generates new username for every test rotation in gitlab. Used in test suite join_game
Generate Player Username
    ${playername} =     Generate Random String      12       [LETTERS][NUMBERS]
    Create A List       PLAYERS
    Append To List      @{PLAYERS}  ${playername}
    Log                 @{PLAYERS}
    [Return]            ${playername}

#Inputs the generated valid username for login. (Test suite join_game)
Input Player Username
    [Arguments]     ${playername}
    Input Text      ${LOC_USER}        ${playername}

Join Game
    [Arguments]     ${faction}  ${password}
    Click Button    ${B_JOINGAME}
    Select From List By Label           ${L_SELECTFACTION}  ${faction}
    Input Text      ${I_JOINPASS}       ${password}
    Click Button    ${B_JOINSUBMIT}
    Handle Alert

Go To Players
    Click Button    ${B_SHOWPLAYERS}

Promote
    ${x} =              Format String           select{}     ${VALID_GAME}
    Click Button

Create A List
    [Arguments]             ${listname}
    @{${listname}} =        Create List
    Set Global Variable     @{${listname}}      @{${listname}}


Log
    [Arguments]     ${x}
    Log To Console  ${x}

#
#   Delete Game
#

Delete Game
    Click Button       ${testit}
    Click Button       ${B_EDITGAME}
    Click Button       ${B_EDELETE}
    Alert Should Be Present     text=Are you sure you want to delete this game     action=ACCEPT       timeout=None
    Alert Should Be Present     text=Game deleted     action=ACCEPT       timeout=None
    Alert Should Be Present     text=Game not found     action=ACCEPT       timeout=None

Check If Any Test Games
    ${status}       ${value} =      Run Keyword And Ignore Error        Page Should Contain Button     ${testit}
    [Return]        ${status}




#Select Game
#    ${x} =              Format String           select{}     ${VALID_GAME}
#    Wait Until Page Contains Element        id=${x}     2
#    Click Button        id=${x}
#    Log                 Game Selected
