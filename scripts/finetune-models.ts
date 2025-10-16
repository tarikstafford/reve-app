/**
 * Fine-Tuning Script for Dream Analyst Models
 *
 * This script creates fine-tuning jobs for Jung and Freud models.
 * Jobs will run on OpenAI's servers (can take several days).
 *
 * Prerequisites:
 * - OpenAI API key with fine-tuning access
 * - Training data in JSONL format
 * - Node.js environment
 *
 * Usage:
 * npx tsx scripts/finetune-models.ts
 *
 * After jobs complete (check OpenAI dashboard):
 * npx tsx scripts/save-finetuned-models.ts
 */

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function uploadTrainingFile(filePath: string): Promise<string> {
  console.log(`📤 Uploading training file: ${filePath}`)

  const file = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: 'fine-tune'
  })

  console.log(`✅ File uploaded successfully. File ID: ${file.id}`)
  return file.id
}

async function createFineTuneJob(
  fileId: string,
  model: string,
  suffix: string
): Promise<{ jobId: string; analystName: string }> {
  console.log(`🚀 Creating fine-tune job for ${suffix}...`)

  const fineTune = await openai.fineTuning.jobs.create({
    training_file: fileId,
    model: model,
    suffix: suffix,
    hyperparameters: {
      n_epochs: 3,
    }
  })

  console.log(`✅ Fine-tune job created. Job ID: ${fineTune.id}`)
  return { jobId: fineTune.id, analystName: suffix }
}

async function startFineTuneJob(
  analystName: string,
  trainingFile: string,
  baseModel: string = 'gpt-4o-2024-08-06'
): Promise<{ jobId: string; analystName: string }> {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🧠 Starting fine-tune job for ${analystName} model`)
  console.log('='.repeat(60))

  try {
    // Upload training file
    const fileId = await uploadTrainingFile(trainingFile)

    // Create fine-tune job
    const jobInfo = await createFineTuneJob(
      fileId,
      baseModel,
      analystName.toLowerCase()
    )

    return jobInfo
  } catch (error) {
    console.error(`❌ Error starting fine-tune for ${analystName}:`, error)
    throw error
  }
}

async function main() {
  console.log('🎯 Dream Analyst Model Fine-Tuning Script')
  console.log('==========================================\n')

  const trainingDataDir = path.join(process.cwd(), 'scripts', 'training-data')

  const jobs: Array<{ jobId: string; analystName: string }> = []

  try {
    // Start Jung fine-tuning job
    const jungFile = path.join(trainingDataDir, 'jung-examples.jsonl')
    const jungJob = await startFineTuneJob('jung', jungFile)
    jobs.push(jungJob)

    // Start Freud fine-tuning job
    const freudFile = path.join(trainingDataDir, 'freud-examples.jsonl')
    const freudJob = await startFineTuneJob('freud', freudFile)
    jobs.push(freudJob)

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('🎉 Fine-tuning jobs created successfully!')
    console.log('='.repeat(60))
    console.log('\n📋 Job IDs (save these):\n')

    jobs.forEach(job => {
      console.log(`${job.analystName.toUpperCase()}: ${job.jobId}`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('⏳ Next Steps:')
    console.log('='.repeat(60))
    console.log('1. Monitor job status at: https://platform.openai.com/finetune')
    console.log('2. Jobs can take several days to complete')
    console.log('3. OpenAI will email you when jobs finish')
    console.log('4. Once complete, run: npx tsx scripts/save-finetuned-models.ts')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ Fine-tuning job creation failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
