*** Settings ***
Documentation   Test Suite for Zooming in and out on the frontpage.
Resource        resource.robot
Suite Setup      Open Browser To Login Page
Suite Teardown   Close Browser

*** Test Cases ***
Zooming On Frontpage
    Valid Login
    Select Game
    Zoom In On Frontpage
    Zoom Out On Frontpage

*** Keywords ***
#
#   USE THE COMMENTED VARIABLES WHEN RUNNING ALL TESTS
#
Valid Login
#    Input Username      ville   #${VALID USER}
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login

