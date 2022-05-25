Pod::Spec.new do |s|
  s.name             = 'DoricCore'
  s.version          = '0.10.11'
  s.summary          = 'Doric iOS SDK'


  s.description      = <<-DESC
Doric iOS SDK for cross platform develpment
                       DESC

  s.homepage         = 'https://github.com/doric-pub/doric'
  s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
  s.author           = { 'pengfei.zhou' => 'pengfeizhou@foxmail.com' }
  s.source           = { :git => 'https://github.com/doric-pub/doric.git', :tag => s.version.to_s }

  s.ios.deployment_target = '8.0'

  s.source_files = 'doric-iOS/Pod/Classes/**/*'
  s.resource_bundles = {
    'Doric' => ['doric-js/bundle/**/*']
  }

  s.public_header_files = 'doric-iOS/Pod/Classes/**/*.h'
  s.dependency 'YogaKit/Core'
  s.dependency 'Yoga'
end
