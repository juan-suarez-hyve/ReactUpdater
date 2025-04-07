# Dir.glob("*-black.svg") {|filename|
#   file = File.new(filename)

#   new_filename = filename.sub(/-black/, '')
#   File.rename(filename, new_filename)
# }


# parse icon_library.json
# for each icon
  # access svg
  # decode svg
  # svg decoded svg inline into html string
# save array to json

require 'json'
file = File.read('./icon-library.json')
data_hash = JSON.parse(file)

data_hash.each do |key, value|

  if value.key?("id")

    svg_file = File.read('./' + value["id"] + '.svg')

    svg_file.gsub!(/<\?xml (.*?)>/, '')
    svg_file.gsub!(/<\!-- (.*?)-->/, '')

    svg_file.gsub!("\n",'')
    svg_file.gsub!("\t",'')

    svg_file.gsub!("#000",'#000000')

    svg_file.gsub!(/"/,"'")

    value["html"].gsub!(/<img (.*?)>/, svg_file)

  end

end


File.write('./icon-library_inlined.json', JSON.dump(data_hash))
