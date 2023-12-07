#!/bin/bash

cat > ./src/app/environement/environement.ts <<EOF
export const environment = {
  production: $( [ -n "$API_URL" ] && [ "$ENV" = "PROD" ] && echo "true" || echo "false" ),
  path: "$( [ -n "$API_URL" ] && [ "$ENV" = "PROD" ] && echo $API_URL )"
};
EOF

ng serve --host 0.0.0.0 --port "$PORT"
