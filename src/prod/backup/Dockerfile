FROM postgres:16-alpine

RUN apk add --no-cache bash curl ca-certificates tzdata aws-cli

WORKDIR /backup
COPY backup.sh /backup/backup.sh
RUN chmod +x /backup/backup.sh

ENTRYPOINT ["/backup/backup.sh"]
