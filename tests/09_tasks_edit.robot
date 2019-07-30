*** Settings ***
Documentation    Test suite for editing tasks. Deleting them and setting the winner.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser

#*** Variables ***
#${DELAY}    0.2

*** Test Cases ***
Task Edit
    Valid Login
    Select Game
    Task Winner Select
    Delete Task
    Delete Completed Task


*** Keywords ***
Valid Login
#    Input Username      ville   #${VALID USER}
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login