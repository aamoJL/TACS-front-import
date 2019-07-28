*** Settings ***
Documentation    A test suite for invalid login.
Resource        resource.robot
Suite Setup     Open Browser To Login Page
Suite Teardown  Close Browser
Test Template      Login With Invalid Credentials Should Fail
*** Test Cases ***
Invalid Username                 invalid        ${VALID PASSWORD}       ${INVALID_U}
Invalid Password                 ${VALID USER}    invalid               ${INVALID_P}
Invalid Username And Password    invalid          whatever              ${INVALID_U}
Empty Username                   ${EMPTY}         ${VALID PASSWORD}     ${SHORT_U}
Empty Password                   ${VALID USER}    ${EMPTY}              ${SHORT_P}
Empty Username And Password      ${EMPTY}         ${EMPTY}              ${SHORT_UP}

*** Keywords ***
Login With Invalid Credentials Should Fail
    [Arguments]    ${username}    ${password}   ${error_text}
    Input Username    ${username}
    Input Password    ${password}
    Submit Credentials Login
    Login Should Have Failed    ${error_text}
    Reload Page

Login Should Have Failed        #Checks the error message.
    [Arguments]     ${error_text}
    Wait Until Page Contains Element     id=loginErrorMessage
    Element Text Should Be          id=loginErrorMessage      ${error_text}
    #Title Should Be    Error Page      #If there's going to be an error page.

