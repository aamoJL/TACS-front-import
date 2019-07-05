*** Settings ***
Documentation   Test Suite for Zooming in and out on the frontpage.
Resource        resource.robot
Suite Setup      Open Browser To Login Page
Suite Teardown   Close Browser

*** Test Cases ***
Zooming On Frontpage
    Zoom In On Frontpage
    Zoom Out On Frontpage