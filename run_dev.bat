call yarn

REM This is to update the index.html file with the correct configuration
REM  Alternatives: res-ai development, res-ai production, d-well development, d-well production
REM Example 1: call python ..\data_questionnaire_agent\build.py res-ai production
REM Example 2: call python ..\data_questionnaire_agent\build.py res-ai development
REM Example 3: call python ..\data_questionnaire_agent\build.py d-well development
REM Example 4: call python ..\data_questionnaire_agent\build.py d-well production
call python ..\data_questionnaire_agent\build.py res-ai development

call yarn build
call yarn dev
