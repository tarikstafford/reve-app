/**
 * Fine-Tuning Script for Dream Analyst Models
 *
 * This script creates fine-tuned GPT-4o models for Jung and Freud
 * using OpenAI's fine-tuning API.
 *
 * Prerequisites:
 * - OpenAI API key with fine-tuning access
 * - Training data in JSONL format
 * - Node.js environment
 *
 * Usage:
 * npx tsx scripts/finetune-models.ts
 */

import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface FineTuneJob {
  id: string
  model: string
  status: string
  fine_tuned_model: string | null
}

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
): Promise<string> {
  console.log(`🚀 Creating fine-tune job for ${suffix}...`)

  const fineTune = await openai.fineTuning.jobs.create({
    training_file: fileId,
    model: model,
    suffix: suffix,
    hyperparameters: {
      n_epochs: 3, // Adjust based on your data size
    }
  })

  console.log(`✅ Fine-tune job created. Job ID: ${fineTune.id}`)
  return fineTune.id
}

async function checkJobStatus(jobId: string): Promise<FineTuneJob> {
  const job = await openai.fineTuning.jobs.retrieve(jobId)
  return {
    id: job.id,
    model: job.model,
    status: job.status,
    fine_tuned_model: job.fine_tuned_model
  }
}

async function waitForCompletion(jobId: string): Promise<string> {
  console.log(`⏳ Waiting for fine-tune job ${jobId} to complete...`)
  console.log('This may take 20-60 minutes depending on data size.')

  let attempts = 0
  const maxAttempts = 120 // 2 hours with 1-minute intervals

  while (attempts < maxAttempts) {
    const status = await checkJobStatus(jobId)

    console.log(`Status: ${status.status}`)

    if (status.status === 'succeeded' && status.fine_tuned_model) {
      console.log(`✅ Fine-tuning completed! Model: ${status.fine_tuned_model}`)
      return status.fine_tuned_model
    }

    if (status.status === 'failed' || status.status === 'cancelled') {
      throw new Error(`Fine-tuning ${status.status}: ${jobId}`)
    }

    // Wait 1 minute before checking again
    await new Promise(resolve => setTimeout(resolve, 60000))
    attempts++
  }

  throw new Error('Fine-tuning timed out after 2 hours')
}

async function fineTuneAnalyst(
  analystName: string,
  trainingFile: string,
  baseModel: string = 'gpt-4o-2024-08-06'
): Promise<string> {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🧠 Fine-tuning ${analystName} model`)
  console.log('='.repeat(60))

  try {
    // Upload training file
    const fileId = await uploadTrainingFile(trainingFile)

    // Create fine-tune job
    const jobId = await createFineTuneJob(
      fileId,
      baseModel,
      analystName.toLowerCase()
    )

    // Wait for completion
    const fineTunedModel = await waitForCompletion(jobId)

    return fineTunedModel
  } catch (error) {
    console.error(`❌ Error fine-tuning ${analystName}:`, error)
    throw error
  }
}

async function main() {
  console.log('🎯 Dream Analyst Model Fine-Tuning Script')
  console.log('==========================================\n')

  const trainingDataDir = path.join(process.cwd(), 'scripts', 'training-data')

  const models: Record<string, string> = {}

  try {
    // Fine-tune Jung model
    const jungFile = path.join(trainingDataDir, 'jung-examples.jsonl')
    models.jung = await fineTuneAnalyst('jung', jungFile)

    // Fine-tune Freud model
    const freudFile = path.join(trainingDataDir, 'freud-examples.jsonl')
    models.freud = await fineTuneAnalyst('freud', freudFile)

    // Print results
    console.log('\n' + '='.repeat(60))
    console.log('🎉 All models fine-tuned successfully!')
    console.log('='.repeat(60))
    console.log('\nAdd these to your .env file:\n')
    console.log(`OPENAI_JUNG_MODEL=${models.jung}`)
    console.log(`OPENAI_FREUD_MODEL=${models.freud}`)
    console.log('\nOr update your environment variables in Vercel dashboard.')

  } catch (error) {
    console.error('\n❌ Fine-tuning failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
