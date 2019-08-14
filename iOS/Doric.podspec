#
# Be sure to run `pod lib lint Doric.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'Doric'
  s.version          = '0.1.0'
  s.summary          = 'A short description of Doric.'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/penfeizhou/doric'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'pengfei.zhou' => 'penfei.zhou@gmail.com' }
  s.source           = { :git => 'git@github.com:penfeizhou/doric.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '8.0'

  s.source_files = 'Pod/Classes/**/*'
  s.resource = "Pod/Assets/*.js"
  s.resource_bundles = {
    'Doric' => ['Pod/Assets/**/*']
  }

  s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  # s.dependency 'AFNetworking', '~> 2.3'
  s.dependency 'SDWebImage', '~> 5.0'
  s.dependency 'SocketRocket', '~> 0.5.1'
  s.dependency 'GCDWebServer', '~> 3.0'
end
