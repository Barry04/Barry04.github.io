require 'jekyll'
require 'nokogiri'

baseline = ARGV.fetch(0, '9940918')
converter = Jekyll::Converters::Markdown.new(Jekyll.configuration({ 'source' => Dir.pwd }))
slugs = %w[vibe-coding-bottleneck agent-skill-memory-governance agent-unreleased-code-compatibility jev-model-thinking]
slugs.each do |slug|
  source = IO.popen(['git', 'show', "#{baseline}:2026/#{slug}.md"], &:read).force_encoding('UTF-8')
  raise "Missing baseline: #{slug}" unless $?.success?
  current = File.read("2026/#{slug}.md", encoding: 'UTF-8')
  raise "Changed code blocks: #{slug}" unless source.scan(/^```.*?^```/m) == current.scan(/^```.*?^```/m)
  source.scan(/\]\(([^\s)]+)(?:\s+[^)]*)?\)/).flatten.each do |target|
    raise "Lost source link: #{target}" unless current.include?(target)
  end
  original_html = Nokogiri::HTML.fragment(converter.convert(source.sub(/\A---.*?---\s*/m, '')))
  built = Nokogiri::HTML(File.read(".tmp-preview/story-baseline/2026/#{slug}.html", encoding: 'UTF-8'))
  ids = built.css('[id]').map { |node| node['id'] }
  original_html.css('h2,h3').each do |heading|
    raise "Lost anchor: #{slug}##{heading['id']}" unless ids.include?(heading['id'])
  end
  raise "Duplicate IDs: #{slug}" unless ids.uniq.size == ids.size
  raise "Raw include leaked: #{slug}" if built.text.include?('{% include')
  puts "PASS: #{slug} — original code blocks, links, h2/h3 anchors; unique IDs and rendered includes"
end
