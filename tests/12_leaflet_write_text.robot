*** Settings ***
Documentation    Test suite for leaflet write text feature.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser

*** Variables ***
#${DELAY}    0.15

*** Test Cases ***
Write Text
    Valid Login
    Select Game
    Write Text


*** Keywords ***
Valid Login
#    Input Username      ville   #${VALID USER}
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login
