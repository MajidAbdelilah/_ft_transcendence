FROM alpine
# RUN cd /usr/src/app
RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    && ln -sf python3 /usr/bin/python \
    && pip install --upgrade pip
WORKDIR /usr/src/app/
RUN mkdir -p backend
COPY . backend/
COPY run.sh backend/
RUN chmod +x backend/run.sh
ENTRYPOINT ["/usr/src/app/backend/run.sh"]
CMD ["tail", "-f", "/dev/null"]