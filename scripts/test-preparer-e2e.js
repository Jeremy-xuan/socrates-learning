#!/usr/bin/env node
/**
 * 预习 Agent 端到端测试脚本
 * 用法: node scripts/test-preparer-e2e.js [知识点]
 */

import('../agents/preparer/index.js').then(async m => {
  const PreparerAgent = m.PreparerAgent;
  const agent = new PreparerAgent();
  
  const topics = process.argv.slice(2);
  const results = [];
  
  console.log('='.repeat(50));
  console.log('🧪 预习 Agent 端到端测试');
  console.log('='.repeat(50));
  
  for (const topic of topics) {
    console.log(`\n📚 测试知识点: ${topic}`);
    console.log('-'.repeat(30));
    
    const start = Date.now();
    const result = await agent.prepare(topic);
    const elapsed = Date.now() - start;
    
    // 验证输出
    const checks = {
      'knowledgePoint 存在': !!result.knowledgePoint,
      'summary.formulas 有内容': result.summary?.formulas?.length > 0,
      'mistakes 有内容': result.mistakes?.length > 0,
      'recommendations 有内容': result.recommendations?.length > 0,
      '输出文件已生成': require('fs').existsSync(`./teacher/runtime/preview/${topic}.json`)
    };
    
    let passed = 0;
    for (const [check, ok] of Object.entries(checks)) {
      console.log(`  ${ok ? '✅' : '❌'} ${check}`);
      if (ok) passed++;
    }
    
    results.push({ topic, passed, total: Object.keys(checks).length, elapsed });
    console.log(`  📊 通过: ${passed}/${Object.keys(checks).length} (${elapsed}ms)`);
  }
  
  // 总结
  console.log('\n' + '='.repeat(50));
  console.log('📈 测试总结');
  console.log('='.repeat(50));
  
  const total = results.reduce((a, r) => a + r.passed, 0);
  const max = results.reduce((a, r) => a + r.total, 0);
  
  for (const r of results) {
    const status = r.passed === r.total ? '✅' : '⚠️';
    console.log(`${status} ${r.topic}: ${r.passed}/${r.total} (${r.elapsed}ms)`);
  }
  
  console.log(`\n🎯 总计: ${total}/${max}`);
  process.exit(total === max ? 0 : 1);
});