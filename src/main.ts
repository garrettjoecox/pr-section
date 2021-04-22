import * as core from '@actions/core';
import * as github from '@actions/github';

(async () => {
  try {
    const token = core.getInput('repo-token', { required: false });
    const sectionName = core.getInput('section-name', { required: true });
    const sectionValue = core.getInput('section-value', { required: false });
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

    const sectionRegex = new RegExp(`(<!--- section:${sectionName}:start -->(.+)<!--- section:${sectionName}:end -->)`, 'gs');

    const sectionText = `<!--- section:${sectionName}:start -->
${sectionValue}
<!--- section:${sectionName}:end -->`;

    let prText = pullRequest.body + '';

    if (prText) {
      if (sectionValue) {
        if (prText.match(sectionRegex)) {
          prText = prText.replace(sectionRegex, sectionText);
        } else {
          prText += '\n\n' + sectionText;
        }
      } else {
        prText = prText.replace(sectionRegex, '');
      }
    } else {
      if (sectionValue) {
        prText += sectionText;
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
