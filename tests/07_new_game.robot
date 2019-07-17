*** Settings ***
Documentation       A test suite for making a new game with existing user.
Resource            resource.robot
Suite Setup         Open Browser To Login Page
Suite Teardown      Close Browser


*** Test Cases ***
Create A New Game
    Valid Login
    Create Game
#    Refresh Browser
    Check Game List
    Log Out

*** Keywords ***
#
#   USE THE COMMENTED VARIABLES WHEN RUNNING ALL TESTS
#
Valid Login
    Input Username      ville   # ${VALID USER}
    Input Password      koira   # ${VALID PASSWORD}
    Submit Credentials Login

Refresh Browser
    Reload Page
    Log     Refreshed

Check Game List
    Select Game