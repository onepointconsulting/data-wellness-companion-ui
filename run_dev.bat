call yarn

REM This is to update the index.html file with the correct configuration
REM  Alternatives: res-ai development, res-ai production, d-well development, d-well production
python ..\data_questionnaire_agent\build.py res-ai development

call yarn build
call yarn dev
