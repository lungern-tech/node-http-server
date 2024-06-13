import yargs from 'yargs'
// import { hideBin } from 'yargs/helpers'
import minimist from 'minimist'

function getServerConfig() {
  yargs()
  .command('curl <url>', 'fetch the contents of the URL', () => {}, (argv) => {
    console.info(argv)
  })
  .help().argv;
}

export default function getConfig() {
  const argv = minimist(process.argv.slice(2));
  let { port, p } = argv
  port = p || port || 8080
  return {
    port
  }
}

