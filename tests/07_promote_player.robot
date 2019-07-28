*** Settings ***
Documentation       A test suite for Promoting players privileges.
Resource            resource.robot
Suite Setup         Open Browser To Login Page
Suite Teardown      Close Browser



*** Test Cases ***
Promote Player To Faction Leader
    Valid Login
    Select Game
    Go To Players
    Promote
    Close Players
    Return To Main Menu
    Log Out

*** Keywords ***

#   USE THE COMMENTED VARIABLES WHEN RUNNING ALL TESTS
Valid Login
#    Input Username      ville   # ${VALID USER}
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login

Close Players
    Click Element       ${B_CLOSEPLAYERS}
