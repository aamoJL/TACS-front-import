*** Settings ***
Documentation    Test suite for leaflet write text feature.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser

*** Test Cases ***
Valid Login     #is taken away when the tests are merged
    Open Login
    Input Username      ville
    Input Password      koira
    Submit Credentials Login

Write Text
    Write Text


*** Keywords ***
