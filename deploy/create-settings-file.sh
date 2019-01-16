echo '{' \
        '"api": {' \
            '"port": $REMOTEML_PORT,' \
            '"path": "$REMOTEML_API_PATH"' \
        '},' \
        '"storage": {' \
            '"url": "$REMOTEML_MONGO_URL",' \
            '"dbName": "$REMOTEML_MONGO_DB_NAME",' \
            '"collectionName": "$REMOTEML_MONGO_COLLECTION_NAME"' \
        '}' \
    '}' \
    > settings.json