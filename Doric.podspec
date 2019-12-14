Pod::Spec.new do |s|
  s.name             = 'Doric'
  s.version          = '0.1.2'
  s.summary          = 'Doric iOS SDK'


  s.description      = <<-DESC
Doric iOS SDK for cross platform develpment
                       DESC

  s.homepage         = 'https://github.com/doric-pub/doric'
  s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
  s.author           = { 'pengfei.zhou' => 'pengfeizhou@foxmail.com' }
  s.source           = { :git => 'https://github.com/doric-pub/doric-iOS.git', :tag => s.version.to_s }

  s.ios.deployment_target = '8.0'

  s.source_files = 'Pod/Classes/**/*'
  s.resource_bundles = {
    'Doric' => ['Pod/Assets/**/*']
  }

  s.public_header_files = 'Pod/Classes/**/*.h'
  s.dependency 'YYWebImage', '~>1.0.5'
  s.dependency 'YYImage/WebP'
  s.dependency 'SocketRocket', '~> 0.5.1'
  s.dependency 'YYCache', '~> 1.0.4'
end
