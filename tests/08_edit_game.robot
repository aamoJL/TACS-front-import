*** Settings ***
Documentation       A test suite for editing game that was previously made.
Resource            resource.robot
Suite Setup         Open Browser To Login Page
Suite Teardown      Close Browser


*** Test Cases ***
Edit Existing Game
    Valid Login
    Select Game
    #Edit Game
    Log Out

*** Keywords ***
#
#   USE THE COMMENTED VARIABLES WHEN RUNNING ALL TESTS
#
Valid Login
    Open Login
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login
