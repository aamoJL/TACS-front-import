*** Settings ***
Documentation       A test suite for making a new game with existing user.
Resource            resource.robot
Suite Setup         Open Browser To Login Page
Suite Teardown      Close Browser

*** Variables ***
${DELAY}    0.2

*** Test Cases ***
Create A New Game
    Valid Login
    Create Game
#    Refresh Browser
    Check Game List
    Return To Main Menu
    Log Out

*** Keywords ***
#
#   USE THE COMMENTED VARIABLES WHEN RUNNING ALL TESTS
#
Valid Login
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login

Refresh Browser
    Reload Page
    Log     Refreshed

Check Game List
    Select Game