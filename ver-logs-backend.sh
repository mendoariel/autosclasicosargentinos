#!/bin/bash

echo "📋 Logs del Backend (últimas 50 líneas):"
echo "=========================================="
docker logs --tail 50 autosclasicos-backend-dev 2>&1 || docker logs --tail 50 autosclasicos-backend 2>&1



