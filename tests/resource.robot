*** Settings ***
Documentation       A resource file with reusable keywords and variables.
Library     SeleniumLibrary    run_on_failure=nothing
Library     String

*** Variables ***
${SERVER}       %{SITE_URL}
${BROWSER}      ff
${DELAY}        0.2
#${VALID USER} =     ville
${VALID PASSWORD} =     koira
${LOGIN URL}        https://${SERVER}/
${WELCOME URL}      #You can use this if there's a different page after login page.
${LOC_USER}           id=registerUsernameInput            #Generated username.
${LOC_PASSWORD}       id=registerPasswordInput            #Generated password first time.
${LOC_PASSWORD2}      id=registerPasswordVerifyInput      #Generated password verify.
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

*** Keywords ***
#Valid Login
Open Browser To Login Page
    Open Browser        ${LOGIN URL}      ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed      ${DELAY}
    Login Page Should be Open

Login Page Should be Open
    Title Should Be     React App


Go To Login Page
    Go To       ${LOGIN URL}
    Login Page Should be Open

Open Login
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
    Click Button        id=logoutButton

Close Login Screen
    Click Element        id=closeLoginFormX

Wait For Log Out Button To Appear
    Wait Until Page Contains Element        id=logoutButton      1

#Registration
Open Registration
    Click Button        id=registerButton

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

Close Registration Screen
    Click Element       id=closeRegisterFormX

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
    Click Element      xpath=//a[contains(.,'${TARGET}')]

Draw A Polyline
    Click Element       css=a[class=leaflet-draw-draw-polyline]
    Drawing A Figure        500     500
    Drawing A Figure        300     500
    Drawing A Figure        300     300
    Drawing A Figure        500     300
    Drawing A Figure        500     500
    Click Leaflet Panel     Delete last point
    Drawing A Figure        500     500
    Drawing A Figure        500     500
    Drawing A Figure        550     300
    Drawing A Figure        550     500
    Click Leaflet Panel     Finish
    Drawing A Figure        600     300
    Drawing A Figure        600     500
    Click Leaflet Panel     Cancel
    Log To Console          \n.Polyline done

Draw A Polygon
    Click Element     css=a[class=leaflet-draw-draw-polygon]
    Drawing A Figure        50      300
    Drawing A Figure        -100    300
    Drawing A Figure        -60     100
    Click Leaflet Panel     Cancel
    Click Element     css=a[class=leaflet-draw-draw-polygon]
    Drawing A Figure        50      300
    Drawing A Figure        -100    300
    Drawing A Figure        -60     100
    Click Leaflet Panel     Delete last point
    Drawing A Figure        -60     100
    Click Leaflet Panel     Finish
    Drawing A Figure        -120    300
    Drawing A Figure        -180    300
    Drawing A Figure        -110    100
    Drawing A Figure        -120    300
    Log To Console          Polygon done

Draw A Rectangle
    Click Element       css=a[class=leaflet-draw-draw-rectangle]
    Drawing A Figure        -200     100
    Drawing A Figure        -0       500
    Click Leaflet Panel     Cancel
    Log To Console          Rectangle done

Draw A Circle
    Click Element       css=a[class=leaflet-draw-draw-circle]
    Mouse Down      class:leaflet-tile-loaded:nth-child(2)
    Mouse Up        class:leaflet-tile-loaded:nth-child(5)
    Click Leaflet Panel     Cancel
    Log To Console          Circle done

Draw A Marker
    Click Element       css=a[class=leaflet-draw-draw-marker]
    Drawing A Figure        200     200
    Drawing A Figure        300     300
    Click Leaflet Panel     Cancel
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
    Click Element       css=a[title="Save changes"]
    Click Element   css=a[class=leaflet-draw-edit-edit]
    Mouse Down      class:leaflet-marker-icon:nth-last-of-type(2)       #Marker
    Mouse Up        class:leaflet-tile-loaded:nth-child(3)              #Marker
    Click Element       css=a[title="Cancel editing, discards all changes"]
    Log To Console      Editing done

Delete Layers
    Click Element   css=a[class=leaflet-draw-edit-remove]
    Click Element   class:leaflet-marker-icon:nth-last-of-type(2)       #Marker
    Click Element       css=a[title="Save changes"]
    Click Element       css=a[class=leaflet-draw-edit-remove]
    Drawing A Figure        50      300
    Click Element       css=a[title="Cancel editing, discards all changes"]
    Click Element       css=a[class=leaflet-draw-edit-remove]
    Click Element       css=a[title="Clear all layers"]
    Log To Console      Deleting done

Map Movement
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     10     100
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     50     300
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     800     800
    Drag And Drop By Offset    css=div[class=leaflet-control-container]     -50     -50
    Log To Console      Map movement tested




#Test

Move Around On The Map Frontpage            #en saanut toimimaan
    #Press Key       //*[@id="root"]/div/div[1]/div[1]       ARROW_LEFT
    Press Combination       Key.









