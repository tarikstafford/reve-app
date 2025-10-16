# Fine-Tuning Dream Analyst Models

This guide explains how to create and deploy fine-tuned GPT models for Jung and Freud dream analysis.

## Overview

By default, Rêve uses GPT-4o with specialized system prompts to simulate Jung and Freud. However, you can fine-tune dedicated models for more authentic, consistent analyses that deeply embody each analyst's voice and theoretical framework.

## Benefits of Fine-Tuning

1. **Authenticity**: Models trained on analyst-specific examples produce more accurate representations of their theoretical frameworks
2. **Consistency**: Fine-tuned models maintain character and approach across all analyses
3. **Performance**: Dedicated models can be faster and more cost-effective than base models with long system prompts
4. **Quality**: Better adherence to each analyst's writing style, terminology, and conceptual approach

## Prerequisites

- OpenAI API key with fine-tuning access (requires paid account)
- Node.js and npm installed
- Access to your Rêve project repository

## Training Data

We've provided curated training examples for both analysts:

- `scripts/training-data/jung-examples.jsonl` - 5 examples of Jungian dream analysis
- `scripts/training-data/freud-examples.jsonl` - 5 examples of Freudian dream analysis

### Training Data Format

Each file uses OpenAI's JSONL format with message arrays:

```jsonl
{
  "messages": [
    {"role": "system", "content": "You are Carl Jung..."},
    {"role": "user", "content": "Analyze this dream: ..."},
    {"role": "assistant", "content": "This dream presents..."}
  ]
}
```

### Expanding Training Data

For better results, consider adding more examples (10-50 recommended):

1. **Source authentic examples**: Use actual writings from Jung's and Freud's dream analysis work
2. **Maintain diversity**: Include various dream themes (flying, falling, pursuit, water, etc.)
3. **Quality over quantity**: Each example should be a genuine, high-quality representation
4. **Consistent format**: Keep the JSONL structure consistent

## Running the Fine-Tuning Script

### Step 1: Set Environment Variables

```bash
# Make sure your OpenAI API key is set
export OPENAI_API_KEY=sk-...
```

### Step 2: Create Fine-Tuning Jobs

```bash
npx tsx scripts/finetune-models.ts
```

The script will:
1. Upload training files to OpenAI
2. Create fine-tuning jobs for Jung and Freud
3. Display job IDs and exit

**Important**: The script creates the jobs and exits immediately. Fine-tuning jobs run on OpenAI's servers and can take **several days** to complete.

Example output:
```
📋 Job IDs (save these):

JUNG: ftjob-abc123xyz
FREUD: ftjob-def456uvw

⏳ Next Steps:
1. Monitor job status at: https://platform.openai.com/finetune
2. Jobs can take several days to complete
3. OpenAI will email you when jobs finish
4. Once complete, run: npx tsx scripts/save-finetuned-models.ts
```

### Step 3: Monitor Progress

Check job status:
- **OpenAI Dashboard**: https://platform.openai.com/finetune
- **Email notifications**: OpenAI sends updates when jobs complete
- Jobs typically take 1-3 days but can be longer depending on queue

### Step 4: Retrieve Model IDs

Once both jobs show "succeeded" status in the dashboard, run:

```bash
npx tsx scripts/save-finetuned-models.ts <jung-job-id> <freud-job-id>
```

Example:
```bash
npx tsx scripts/save-finetuned-models.ts ftjob-abc123xyz ftjob-def456uvw
```

The script will output:

```
✅ Both models fine-tuned successfully!

📝 Add these to your .env file:

OPENAI_JUNG_MODEL=ft:gpt-4o-2024-08-06:your-org:jung:abc123
OPENAI_FREUD_MODEL=ft:gpt-4o-2024-08-06:your-org:freud:xyz789

📦 For production (Vercel):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the two variables above
3. Redeploy your app
```

Add these to your `.env` file locally and to your Vercel environment variables in production.

## Deploying Fine-Tuned Models

### Local Development

```bash
# Add to .env
OPENAI_JUNG_MODEL=ft:gpt-4o-2024-08-06:your-org:jung:abc123
OPENAI_FREUD_MODEL=ft:gpt-4o-2024-08-06:your-org:freud:xyz789
```

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add both variables:
   - `OPENAI_JUNG_MODEL`
   - `OPENAI_FREUD_MODEL`
4. Redeploy your application

## How the API Uses Fine-Tuned Models

The dream creation API (`app/api/dreams/create/route.ts`) automatically detects fine-tuned models:

```typescript
// If environment variables are set, use fine-tuned models
const fineTunedModels = {
  jung: process.env.OPENAI_JUNG_MODEL || '',
  freud: process.env.OPENAI_FREUD_MODEL || ''
}

// Fine-tuned models don't need system prompts
const model = fineTunedModels[analystId] || 'gpt-4o'
```

**Graceful Fallback**: If no fine-tuned models are configured, the system uses GPT-4o with system prompts (current behavior).

## Monitoring and Management

### Check Fine-Tuning Status

```typescript
// In Node.js/TypeScript
import OpenAI from 'openai'
const openai = new OpenAI()

const job = await openai.fineTuning.jobs.retrieve('ftjob-abc123')
console.log(job.status) // 'succeeded', 'running', 'failed'
```

### List Your Fine-Tuned Models

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Delete a Fine-Tuned Model

```bash
curl -X DELETE https://api.openai.com/v1/models/ft:gpt-4o:your-org:suffix:id \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Cost Considerations

### Training Costs
- GPT-4o fine-tuning: ~$25 per 1M training tokens
- Our 5-example datasets: ~$0.10-0.50 per model
- Larger datasets (50 examples): ~$1-5 per model

### Inference Costs
- Base GPT-4o: $2.50 per 1M input tokens
- Fine-tuned GPT-4o: $3.75 per 1M input tokens (1.5x multiplier)
- **Trade-off**: Fine-tuned models may use fewer tokens overall (no long system prompts)

## Improving Model Quality

### Add More Training Examples

The provided 5 examples are a starting point. For production quality:

1. **Target**: 20-50 high-quality examples per analyst
2. **Sources**:
   - Jung's "Man and His Symbols"
   - Freud's "The Interpretation of Dreams"
   - Academic papers on dream analysis
   - Existing dream interpretations from each school

3. **Balance**: Include diverse dream themes and analysis depths

### Validation Strategy

Before deploying to production:

1. Generate test dreams
2. Compare outputs from base vs fine-tuned models
3. Evaluate for:
   - Theoretical accuracy
   - Stylistic consistency
   - Appropriate use of terminology
   - Depth and insight quality

### Hyperparameter Tuning

Adjust in `scripts/finetune-models.ts`:

```typescript
hyperparameters: {
  n_epochs: 3,  // Increase for more training (3-10 typical)
  // Batch size and learning rate are auto-configured
}
```

## Troubleshooting

### "Insufficient quota"
- Your OpenAI account needs fine-tuning access
- Upgrade to a paid plan with sufficient credits

### "Training file validation failed"
- Check JSONL format (one JSON object per line)
- Verify message structure matches OpenAI spec
- Ensure UTF-8 encoding

### "Fine-tuning job failed"
- Check training data quality
- Ensure sufficient variety in examples
- Review OpenAI dashboard for specific error messages

### Models producing generic responses
- Add more training examples
- Increase n_epochs
- Ensure training data strongly exemplifies analyst's style

## Testing Your Fine-Tuned Models

```typescript
// Test script: scripts/test-analyst-models.ts
import OpenAI from 'openai'

const openai = new OpenAI()

const testDream = "I was flying over a dark forest..."

const response = await openai.chat.completions.create({
  model: process.env.OPENAI_JUNG_MODEL!,
  messages: [
    {
      role: 'user',
      content: `Analyze this dream: ${testDream}`
    }
  ]
})

console.log(response.choices[0].message.content)
```

## Adding New Analysts

To add analysts beyond Jung and Freud:

1. Create training data: `scripts/training-data/new-analyst-examples.jsonl`
2. Add system prompt to `app/api/dreams/create/route.ts`
3. Add analyst profile to `lib/analysts/profiles.ts`
4. Update fine-tuning script to include new analyst
5. Add environment variable: `OPENAI_NEWANALYST_MODEL`

## References

- [OpenAI Fine-Tuning Guide](https://platform.openai.com/docs/guides/fine-tuning)
- [Fine-Tuning Best Practices](https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference/fine-tuning)

## Support

For issues or questions:
- Check OpenAI fine-tuning dashboard for job status
- Review training data format and quality
- Consult OpenAI documentation
- Open an issue in the repository

---

**Last Updated**: 2025-01-15
**Compatible with**: GPT-4o (2024-08-06) and later
