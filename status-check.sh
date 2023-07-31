echo "We will need to wait ~5-10 minutes for things to settle down, migrations to finish, and TLS certs to be issued"
echo ""
echo "⏳ Waiting for OneUptime to boot (this will take a few minutes)"

echo "Checking API Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/api/status)" != "200" ]]; do sleep 5; done'
echo "API is up ✔️"

echo "Checking Dashboard Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/dashboard/status)" != "200" ]]; do sleep 5; done'
echo "Dashboard is up ✔️"

echo "Checking File Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/file/status)" != "200" ]]; do sleep 5; done'
echo "File server is up ✔️"

echo "Checking Status Page Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/status-page/status)" != "200" ]]; do sleep 5; done'
echo "Status Page Server is up ✔️"

echo "Checking Home Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/status)" != "200" ]]; do sleep 5; done'
echo "Home Server is up ✔️"

echo "Checking Accounts Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/accounts/status)" != "200" ]]; do sleep 5; done'
echo "Accounts Server is up ✔️"

echo "Checking Notification Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/notification/status)" != "200" ]]; do sleep 5; done'
echo "Notification Server is up ✔️"

echo "Checking Worker Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/workers/status)" != "200" ]]; do sleep 5; done'
echo "Worker Server is up ✔️"

echo "Checking Identity Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/identity/status)" != "200" ]]; do sleep 5; done'
echo "Identity Server is up ✔️"

echo "Checking Workflow Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/workflow/status)" != "200" ]]; do sleep 5; done'
echo "Workflow Server is up ✔️"

echo "Checking API Docs Server Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/reference/status)" != "200" ]]; do sleep 5; done'
echo "API Docs Server is up ✔️"

echo "Checking Link Shortener Status..."
bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost/l/status)" != "200" ]]; do sleep 5; done'
echo "Link Shortener Server is up ✔️"

echo "⌛️ OneUptime is up!"
echo ""
echo "🎉🎉🎉  Done! 🎉🎉🎉"

echo "We would like to hear your feedback to make this product better for you and for other users, please email us at hello@oneuptime.com."
echo " - If you notice a bug, we will fix it for you."
echo " - If you need a feature, we will add that to the roadmap and let you know the estimated time to ship."
echo "We would love to hear your feedback. Email: hello@oneuptime.com"