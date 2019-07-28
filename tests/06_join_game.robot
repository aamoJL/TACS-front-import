*** Settings ***
Documentation       A test suite for players to join game.
Resource            resource.robot
Suite Setup         Open Browser To Login Page
Suite Teardown      Close Browser
Test Template       Join Game And Faction


*** Test Cases ***
First Player        Faction1    Pass1
Second Player       Faction2    Pass2

*** Keywords ***
#
Join Game And Faction
    [Arguments]     ${faction}  ${password}
    Registration Process
    Select Game
    Join Game       ${faction}  ${password}
    Return To Main Menu
    Log Out

Registration Process
    Open Registration
    ${playername} =         Generate Player Username
    Input Player Username   ${playername}
    Input Valid Password
    Submit Credentials Registration
