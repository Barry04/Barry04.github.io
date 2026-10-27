require 'jekyll'
require 'nokogiri'

# Pass the pre-change revision: bundle exec ruby tools/check-story-content.rb <revision>
baseline = ARGV.fetch(0, 'HEAD')
original = IO.popen(['git', 'show', "#{baseline}:2026/skill-lifecycle.md"], &:read).force_encoding('UTF-8')
raise 'Could not read baseline article' unless $?.success?
current = File.read('2026/skill-lifecycle.md', encoding: 'UTF-8')
normalize = ->(text) { text.lines.map { |line| line.strip.sub(/ \{#[^}]+\}\z/, '') }.reject(&:empty?) }
source_lines = normalize.call(original)
current_lines = normalize.call(current)
cursor = 0
source_lines.each do |line|
  found = current_lines[cursor..].index(line)
  raise "Missing original content: #{line[0, 100]}" unless found
  cursor += found + 1
end
converter = Jekyll::Converters::Markdown.new(Jekyll.configuration({ 'source' => Dir.pwd }))
source_html = Nokogiri::HTML.fragment(converter.convert(original.sub(/\A---.*?---\s*/m, '')))
built = Nokogiri::HTML(File.read('.tmp-preview/story-baseline/2026/skill-lifecycle.html', encoding: 'UTF-8'))
source_html.css('h2,h3').each do |heading|
  corresponding = built.css('.prose h2,.prose h3').find { |node| node.text == heading.text }
  raise "Changed original heading ID: #{heading.text}" unless corresponding && corresponding['id'] == heading['id']
end
raise 'Changed original code blocks' unless current.scan(/^```.*?^```/m) == original.scan(/^```.*?^```/m)
puts "PASS: #{source_lines.size} original content lines, all code blocks and #{source_html.css('h2,h3').size} heading anchors preserved"
