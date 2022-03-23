
const fs = require('fs-extra');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const handlebars = require('handlebars');
const download = require('download-git-repo');
const symbols = require('log-symbols');

// 用户输入交互
const prompts = [
    {
        type:'input',
        message:'项目名称: ',
        name:'projectName',
        validate: val =>{
            if (fs.existsSync(val)) {
                return chalk.red('该项目已存在，请重新输入项目名称!');
            }
            if(val === ''){
                return chalk.red('项目名称不能为空，请输入项目名称!');
            }
            return true;
        }
    },
    {
        type:'input',
        message:'描述: ',
        name:'description'
    }
];
function replaceFile (inputInfos) {
    const fileName = `${inputInfos.projectName}/package.json`;
    const meta = {
        name: inputInfos.projectName,
        description: inputInfos.description
    }
    if (fs.existsSync(fileName)) {
        const content = fs.readFileSync(fileName).toString();
        const result = handlebars.compile(content)(meta);
        fs.writeFileSync(fileName, result);
    }
}
function downloadFiles() {
    inquirer.prompt(prompts).then(inputInfos => {
        const url = 'https://gitee.com/xian-jin/temp.git';
        download(`direct:${url}`,
            inputInfos.projectName,
            { clone: true },
            res => {
                const spinner = ora('正在下载项目模板...');
                spinner.start();
                if (!res) {
                    spinner.succeed();
                    replaceFile(inputInfos);
                    console.log(symbols.success, chalk.green('项目模板下载完成!'));
                } else {
                    spinner.fail();
                    console.log(symbols.error, chalk.red(`项目模板下载失败 ${res}`));
                }
        });
    });
}
module.exports = downloadFiles
