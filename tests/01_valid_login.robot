*** Settings ***
Documentation       A test suite for valid login.
...                 Keywords imported from a resource file.
Resource        resource.robot

*** Test Cases ***
Valid Login
    Open Browser To Login Page
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login
    Log Out
    [Teardown]      Close Browser