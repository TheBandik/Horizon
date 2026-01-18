#!/usr/bin/env bash
set -euo pipefail

: "${POSTGRES_HOST:?}"
: "${POSTGRES_DB:?}"
: "${POSTGRES_USER:?}"
: "${POSTGRES_PASSWORD:?}"

: "${S3_ENDPOINT:?}"
: "${S3_BUCKET:?}"
: "${S3_REGION:?}"
: "${S3_ACCESS_KEY_ID:?}"
: "${S3_SECRET_ACCESS_KEY:?}"
: "${S3_PREFIX:?}"

: "${BACKUP_SCHEDULE:=30 3 * * *}"
: "${BACKUP_RETENTION_DAYS:=14}"

export PGPASSWORD="${POSTGRES_PASSWORD}"
export AWS_ACCESS_KEY_ID="${S3_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${S3_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="${S3_REGION}"

run_backup () {
  TS="$(date +"%Y-%m-%d_%H-%M-%S")"
  FILE="pg_${POSTGRES_DB}_${TS}.dump.gz"
  LOCAL="/tmp/${FILE}"
  S3URI="s3://${S3_BUCKET}/${S3_PREFIX}/${FILE}"

  echo "[backup] start ${TS}"
  pg_dump -h "${POSTGRES_HOST}" -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -Fc | gzip > "${LOCAL}"

  echo "[backup] upload ${S3URI}"
  aws --endpoint-url "${S3_ENDPOINT}" s3 cp "${LOCAL}" "${S3URI}"

  rm -f "${LOCAL}"
  echo "[backup] done"
}

CRON_FILE="/etc/crontabs/root"
echo "${BACKUP_SCHEDULE} /backup/backup.sh --run >> /var/log/backup.log 2>&1" > "${CRON_FILE}"
echo "[backup] cron installed: ${BACKUP_SCHEDULE}"

if [[ "${1:-}" == "--run" ]]; then
  run_backup
  exit 0
fi

crond -f -l 8
