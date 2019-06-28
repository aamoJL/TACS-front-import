*** Settings ***
Documentation       A test suite for valid login.
...                 Keywords imported from a resource file.
Resource        resource.robot

*** Test Cases ***
Valid Login
    Open Browser To Login Page
    Open Login
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login
    Wait For Log Out Button To Appear
    Log Out
    [Teardown]      Close Browser