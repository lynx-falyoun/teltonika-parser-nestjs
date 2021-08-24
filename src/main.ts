import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FmbParser } from './fmb-parser';
import { AvlRecord, AvlPacket} from './models';


const testCodec8 = () => {
  let codec8packet = '000000000000004308020000016B40D57B480100000000000000000000000000000001010101000000000000016B40D5C198010000000000000000000000000000000101010101000000020000252C';

  const buff = Buffer.from(codec8packet, 'hex');
  const fmbParser = new FmbParser(buff);
  const avl: AvlPacket = fmbParser.avl;

  // const avlPacket = new AvlPacket(
  //   avl.records,
  //   avl.zero,
  //   avl.data_length,
  //   avl.codec_id,
  //   avl.number_of_data,
  //   avl.number_of_data2,
  //   avl.CRC
  // );
  // console.log(avlPacket);
  for (let i = 0; i < avl.records.length; i++) {
    const avlRecord: AvlRecord = avl.records[i];
    console.log(avlRecord)
    // const avlInstance = new AvlRecord(
    //   avlRecord.priority,
    //   avlRecord.timestamp,
    //   avlRecord.gps,
    //   avlRecord.event_id,
    //   avlRecord.properties_count,
    //   avlRecord.ioElements
    // )
     // avlInstance.print();
  }
}

const testCodec16 = () => {
  const codec16Packet = '000000000000005F10020000016BDBC7833000000000000000000000000000000000000B05040200010000030002000B00270042563A00000000016BDBC7871800000000000000000000000000000000000B05040200010000030002000B00260042563A00000200005FB3';
  const buff = Buffer.from(codec16Packet, "hex");
  const parser = new FmbParser(buff);
  console.log(parser.avl);
};


const testCodec12 = () => {

  // Test
  // Sending command to device
  let codec12packet = '000000000000000F0C010500000007676574696E666F0100004312';
  const buff = Buffer.from(codec12packet, 'hex');
  const fmbParser = new FmbParser(buff);
  console.log(fmbParser.avl)

  // Test
  // Getting back response from device
  let codec12FromDevicePacket = '00000000000000900C010600000088494E493A323031392F372F323220373A3232205254433A323031392F372F323220373A3533205253543A32204552523A312053523A302042523A302043463A302046473A3020464C3A302054553A302F302055543A3020534D533A30204E4F4750533A303A3330204750533A31205341543A302052533A332052463A36352053463A31204D443A30010000C78F'
  const buffer = Buffer.from(codec12FromDevicePacket, 'hex');
  const fromDeviceFmbParser = new FmbParser(buffer);
  console.log(fromDeviceFmbParser.avl)

};

const testCodec13 = () => {
  let codec13packet = '00000000000000170D0105000000070A81C320676574696E666F0100006855';
  const buff = Buffer.from(codec13packet, 'hex');
  const fmbParser = new FmbParser(buff);
  console.log(fmbParser.avl)

};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('port');
  await app.listen(port);
}

(async () => {
  try {
    await bootstrap();
    console.log('Server is up and running...');
    console.log('---------------------------------------------------------------------------------------------------');
    console.log("Codec 8");
    console.log('---------------------------------------------------------------------------------------------------');
    testCodec8();
    console.log('---------------------------------------------------------------------------------------------------');
    console.log("Codec 16");
    console.log('---------------------------------------------------------------------------------------------------');
    testCodec16();
    console.log('---------------------------------------------------------------------------------------------------');
    console.log("Codec 12");
    console.log('---------------------------------------------------------------------------------------------------');
    testCodec12();
    console.log("Codec 13");
    console.log('---------------------------------------------------------------------------------------------------');
    testCodec13();
  } catch (e) {
    console.error(e);
  }
})();
