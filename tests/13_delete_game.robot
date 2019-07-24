*** Settings ***
Documentation    Test suite for deleting games.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser
*** Test Cases ***
Delete Game
    Valid Login
    :FOR        ${i}        IN RANGE        3
    \       Delete Game
    \       ${check} =   Check If Any Test Games
    \       Exit For Loop If                "${check}"=="FAIL"


*** Keywords ***
Valid Login
#    Input Username      ville   #${VALID USER}
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login



