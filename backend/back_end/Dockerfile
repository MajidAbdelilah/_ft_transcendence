FROM python:3.9-bullseye
RUN pip install --upgrade pip
ENV PIP_ROOT_USER_ACTION=ignore
WORKDIR /app
RUN mkdir backend
COPY . backend/
RUN chmod +x /app/backend/run.sh
ENTRYPOINT ["/app/backend/run.sh"]
# CMD ["python", "/app/backend/manage.py", "runserver"]