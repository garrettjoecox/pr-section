import * as core from '@actions/core';
import * as github from '@actions/github';

const FS_DIFF_SECTION_REGEX = /(<!--- fs:start -->(.+)<!--- fs:end -->)/gs;
const DIFF_HEADER_REGEX = /(^(.+)\+\+\+ [\w\/\.]+\n)/s;

(async () => {
  try {
    const token = core.getInput('repo-token', { required: false });
    const diff = core.getInput('diff', { required: false });
    const client = new github.GitHub(token);

    const prNumber = github.context.payload.pull_request?.number;
    if (!prNumber) {
      console.log('Could not get pull request number from context, exiting');
      return;
    }

    const { data: pullRequest } = await client.pulls.get({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber
    });

    const fsDiffText = `<!--- fs:start -->
<details>
<summary>File System Diff</summary>

\`\`\`diff
${diff.replace(/%0A/gs, '\n').replace(DIFF_HEADER_REGEX, '')}
\`\`\`
</details>
<!--- fs:end -->`;

    let prText = pullRequest.body + '';

    if (prText) {
      if (diff) {
        prText = prText.replace(FS_DIFF_SECTION_REGEX, fsDiffText);
      } else {
        prText = prText.replace(FS_DIFF_SECTION_REGEX, '');
      }
    } else {
      if (diff) {
        prText = fsDiffText;
      } else {
      }
    }

    await client.pulls.update({
      body: prText,
      pull_number: prNumber,
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
    });
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
})();
