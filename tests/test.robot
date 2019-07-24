*** Settings ***
Documentation       test datetime
Resource            resource.robot
#Suite Setup         Open Browser To Login Page
#Suite Teardown      Close Browser

Library     DateTime

*** Test Cases ***
Time Test
    Date

*** Keywords ***
Date
    ${datetime} =   Get Current Date    result_format=%Y-%m-%d %H:%M
    ${date}  ${time} =  Split String    ${datetime}
    Log To Console      ${date}
    Log To Console      ${time}

    ${random} =     Evaluate    random.randint(0, 5)    modules=random

    Log To Console  ${random}

    ${new} =    Add Time To Date  ${date}   ${random} days
    Log To Console      ${new}

    ${new} =    Add Time To Date  ${new}   ${random} hours
    Log To Console      ${new}