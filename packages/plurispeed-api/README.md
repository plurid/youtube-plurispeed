# plurispeed API


```
curl -X POST http://localhost:9090/create-diarization \
    -H "Content-Type: application/json" \
    -d '{
            "url": "<url>",
            "data": {
                "labels": [<labels>],
                "segments": [
                    <[segment]>
                ]
            }
        }'
```
