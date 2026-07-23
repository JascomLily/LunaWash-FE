import json

log_path = r'C:\Users\QUANG TRUONG\.gemini\antigravity\brain\707e85dd-19e9-41c9-9035-3a833501e978\.system_generated\logs\transcript_full.jsonl'
output_path = r'd:\SWP\LunaWash-FE\extracted.jsx'
target_time = '2026-07-23T09:00:41Z'

last_content = None

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            entry = json.loads(line)
            if entry.get('created_at', '') > target_time:
                break
            
            if 'tool_calls' in entry:
                for call in entry['tool_calls']:
                    if call['name'] in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
                        args = call['args']
                        if 'TechnicalPage.jsx' in args.get('TargetFile', ''):
                            if 'CodeContent' in args:
                                last_content = args['CodeContent']
                            elif 'ReplacementContent' in args:
                                # Not handling replace correctly here, but we just want the last full write
                                pass
        except Exception as e:
            pass

if last_content:
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(last_content)
    print("Successfully restored TechnicalPage.jsx")
else:
    print("Could not find the content")
