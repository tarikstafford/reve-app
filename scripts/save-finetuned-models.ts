/**
 * Save Fine-Tuned Model IDs Script
 *
 * Run this after fine-tuning jobs complete on OpenAI.
 * It retrieves the final model IDs and shows you what to add to your .env
 *
 * Usage:
 * npx tsx scripts/save-finetuned-models.ts <jung-job-id> <freud-job-id>
 *
 * Example:
 * npx tsx scripts/save-finetuned-models.ts ftjob-abc123 ftjob-xyz789
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface FineTuneJob {
  id: string
  status: string
  fine_tuned_model: string | null
  error?: {
    message: string
  } | null
}

async function getJobStatus(jobId: string): Promise<FineTuneJob> {
  const job = await openai.fineTuning.jobs.retrieve(jobId)
  return {
    id: job.id,
    status: job.status,
    fine_tuned_model: job.fine_tuned_model,
    error: job.error
  }
}

async function main() {
  console.log('🎯 Fine-Tuned Model Retrieval Script')
  console.log('=====================================\n')

  const args = process.argv.slice(2)

  if (args.length !== 2) {
    console.error('❌ Error: Please provide both job IDs')
    console.error('\nUsage:')
    console.error('  npx tsx scripts/save-finetuned-models.ts <jung-job-id> <freud-job-id>')
    console.error('\nExample:')
    console.error('  npx tsx scripts/save-finetuned-models.ts ftjob-abc123 ftjob-xyz789')
    console.error('\nFind your job IDs at: https://platform.openai.com/finetune')
    process.exit(1)
  }

  const [jungJobId, freudJobId] = args

  try {
    console.log('📋 Retrieving job statuses...\n')

    // Get Jung job status
    console.log(`Checking Jung job: ${jungJobId}`)
    const jungJob = await getJobStatus(jungJobId)
    console.log(`Status: ${jungJob.status}`)

    // Get Freud job status
    console.log(`\nChecking Freud job: ${freudJobId}`)
    const freudJob = await getJobStatus(freudJobId)
    console.log(`Status: ${freudJob.status}`)

    console.log('\n' + '='.repeat(60))

    // Check if both succeeded
    const bothSucceeded =
      jungJob.status === 'succeeded' &&
      freudJob.status === 'succeeded' &&
      jungJob.fine_tuned_model &&
      freudJob.fine_tuned_model

    if (bothSucceeded) {
      console.log('✅ Both models fine-tuned successfully!')
      console.log('='.repeat(60))
      console.log('\n📝 Add these to your .env file:\n')
      console.log(`OPENAI_JUNG_MODEL=${jungJob.fine_tuned_model}`)
      console.log(`OPENAI_FREUD_MODEL=${freudJob.fine_tuned_model}`)
      console.log('\n' + '='.repeat(60))
      console.log('📦 For production (Vercel):')
      console.log('='.repeat(60))
      console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables')
      console.log('2. Add the two variables above')
      console.log('3. Redeploy your app')
      console.log('='.repeat(60))
    } else {
      console.log('⚠️  Some jobs are not complete yet')
      console.log('='.repeat(60))

      if (jungJob.status !== 'succeeded') {
        console.log(`\n❌ Jung job status: ${jungJob.status}`)
        if (jungJob.error) {
          console.log(`   Error: ${jungJob.error.message}`)
        }
      }

      if (freudJob.status !== 'succeeded') {
        console.log(`\n❌ Freud job status: ${freudJob.status}`)
        if (freudJob.error) {
          console.log(`   Error: ${freudJob.error.message}`)
        }
      }

      console.log('\n💡 If jobs are still running:')
      console.log('   - Check status at: https://platform.openai.com/finetune')
      console.log('   - Re-run this script when jobs complete')
      console.log('='.repeat(60))
    }

  } catch (error) {
    console.error('\n❌ Error retrieving job status:', error)
    console.error('\nMake sure:')
    console.error('1. Job IDs are correct')
    console.error('2. OPENAI_API_KEY is set in your environment')
    console.error('3. You have access to these fine-tuning jobs')
    process.exit(1)
  }
}

main()
