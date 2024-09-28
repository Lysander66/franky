#!/bin/bash
BACKUP_DIR="/Users/lysander/Downloads"
CONTAINER_NAME="my-postgres"
DB_USER="postgres"
DB_NAME="demo"

docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql.gz
