const getBinaryPath = require('tdl-binary')
const { Client } = require('tdlnode')

const path = require('path')

const phone_number = '+13234127641'
const api_id = '3573285'
const api_hash = '0be177e6596ecb54ec01b3b54a8b5c99'

console.log("Path:", getBinaryPath());

const configuration = {
  path_to_binary_file: getBinaryPath(),
  // path_to_binary_file: path.resolve(__dirname, '../tdlib/lib/libtdjson'),
  // database_directory: path.resolve(__dirname, '../tdlib/storage'),
  // files_directory: path.resolve(__dirname, '../tdlib/downloads'),
  // log_file_path: path.resolve(__dirname, '../tdlib/logs/tdl.log'),
}

const teleClient = new Client({ api_id, api_hash, phone_number }, configuration);

console.log(teleClient);
