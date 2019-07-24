*** Settings ***
Documentation    Test suite for tasks. Adding new ones and more?
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser
Test Template   Invalid New Task

*** Variables ***
${ge_tnd} =     Generate Task Name/Description

*** Test Cases ***
Valid Login     #is taken away when the tests are merged
    [Template]      NONE
    Valid Login
Select Game
    [Template]       NONE
    Select Game
Create Task List
    [Template]      NONE
    Create Task List
Valid Task
    [Template]      NONE
    Valid Task      ${FACTION1}
Add Task
    [Template]      NONE
    Add Task        ${FACTION2}
    Add Task        ${ALLFACTIONS}

Short Name                          ${ge_tnd}       2       6
#Long Name                           ${ge_tnd}       32      6
#Long Description                    ${ge_tnd}       12      256
Short Name Long Description         ${ge_tnd}       2       256
#Long Name/Description               ${ge_tnd}       32      256


*** Keywords ***
Valid Login
#    Input Username      ville   #${VALID USER}
    Input Username      ${VALID USER}
    Input Password      ${VALID PASSWORD}
    Submit Credentials Login


Invalid New Task
    [Arguments]     ${keyword}     ${task_n}       ${task_d}
    Run Keyword     ${keyword}        ${task_n}       ${task_d}
    Submit Task
    Alert Should Not Be Present     action=ACCEPT       timeout=0

Valid Task
    [Arguments]     ${faction}
    Click Tasks
    Run Keyword     Generate Task Name              12
    Run Keyword     Generate Task Description       12
    Select Faction      ${faction}
    Submit Task
    Alert Should Be Present     text=Task added     action=ACCEPT       timeout=None

Add Task
    [Arguments]     ${faction}
    Run Keyword     Generate Task Name              12
    Run Keyword     Generate Task Description       12
    Select Faction      ${faction}
    Submit Task
    Alert Should Be Present     text=Task added     action=ACCEPT       timeout=None

Select Game
    ${x} =              Format String           select{}     ${VALID_GAME}
    Wait Until Page Contains Element        id=${x}     1
    Click Button        id=${x}
    Log                 Game Selected