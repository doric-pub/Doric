Pod::Spec.new do |s|
    s.name             = '__$RawName__'
    s.version          = '0.1.0'
    s.summary          = 'Doric extension library'
  
    #s.description      = <<-DESC
    #                         DESC

    s.homepage         = 'http://xxx'
    s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
    s.author           = { 'xxx' => 'xxx@xxx' }
    s.source           = { :git => 'git@xxx', :tag => s.version.to_s }
  
    s.ios.deployment_target = '10.0'
  
    s.source_files = 'iOS/Classes/**/*'
    s.resource     =  "dist/**/*"
    s.public_header_files = 'iOS/Classes/**/*.h'
    s.dependency 'DoricCore'
end
