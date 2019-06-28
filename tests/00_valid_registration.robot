*** Settings ***
Documentation    A test suite for valid registration.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser

*** Test Cases ***
Registration Process
    Open Registration
    Generate Valid Username
    Input Valid Username
    Input Valid Password
    Submit Credentials Registration
    Log Out
