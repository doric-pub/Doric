Pod::Spec.new do |s|
  s.name             = 'DoricDevkit'
  s.version          = '0.3.7'
  s.summary          = 'Doric iOS Devkit'

  s.description      = <<-DESC
Doric iOS Devkit for debugging & hotload.
                       DESC

  s.homepage         = 'https://github.com/doric-pub/doric'
  s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
  s.author           = { 'Jingpeng Wang' => 'jingpeng.wang@outlook.com' }
  s.source           = { :git => 'https://github.com/doric-pub/doric.git', :tag => s.version.to_s }

  s.ios.deployment_target = '8.0'

  s.source_files = 'doric-iOS/Devkit/Classes/**/*'

  s.public_header_files = 'doric-iOS/Devkit/Classes/**/*.h'

  s.dependency 'DoricCore'
end
