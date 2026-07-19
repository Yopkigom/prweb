# 코딩은 이렇게 하고 있어요

간단한 설명: 코딩 예제로 보는 스타일

개인 라이브러리 코드 중의 하나인 ZIPUtility 입니다.
Unity3D의 Runtime Main Thread의 부하를 줄이는 것에 초점이 맞춰져 있습니다.

압축 기능은 MemoryStream을 사용해 파일들을 압축하고 있는데,
Runtime 안에서 Json 같은 10mb 이하의 데이터를 빠르게 압축하는 용도로 만들었습니다.
필요하다면 FileStream 기반의 압축 기능도 만들어야겠지요.

CompressAsync와 CompressAsyncFast의 차이는 Worker Thread를 비동기로 쓰냐 동기로 쓰냐의 차이인데,
여러 압축 파일을 한번에 많이 만드는 상황(대략 3개 이상)이 아니라면
CompressAsyncFast를 쓰는 것이 더 빠르게 동작하여 함수를 두 개로 구성하였습니다.

```csharp
using System;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Library.ZIP
{
	/// <summary>
	/// Unity3D Runtime의 특성에 맞춘 파일 압축/해제 기능입니다.
	/// </summary>
	public class ZIPUtility
	{
		/// <summary>
		/// 파일들을 ZIP으로 압축합니다.
		/// </summary>
		/// <param name="destinationPath">생성할 ZIP 파일 경로</param>
		/// <param name="filePaths">압축할 파일 경로들</param>
		public static void Compress(string destinationPath, IEnumerable<string> filePaths)
		{
			ValidateCompressParameters(destinationPath, filePaths);

			using var zipMemoryStream = new MemoryStream();
			using var zipArchive = new ZipArchive(zipMemoryStream, ZipArchiveMode.Create, true);

			foreach (var eachPath in filePaths)
			{
				if (File.Exists(eachPath) == false)
					continue;

				var eachFileName = Path.GetFileName(eachPath);
				var zipEntity = zipArchive.CreateEntry(eachFileName);

				using var entryStream = zipEntity.Open();
				using var readStream = File.OpenRead(eachPath);
				readStream.CopyTo(entryStream);
				entryStream.Flush();
			}

			// Seen Comment : 여기서 명시적으로 Dispose 하지 않으면
			// 나중에 압축 할 때 "Unexpected end of data" 오류가 발생한다.
			zipArchive.Dispose();

			using var zipFileStream = new FileStream(destinationPath, FileMode.Create);
			zipMemoryStream.Seek(0, SeekOrigin.Begin);
			zipMemoryStream.CopyTo(zipFileStream);
			zipFileStream.Flush();
		}

		/// <summary>
		/// 파일들을 비동기로 ZIP 압축합니다.
		/// </summary>
		/// <param name="destinationPath">생성할 ZIP 파일 경로</param>
		/// <param name="filePaths">압축할 파일 경로들</param>
		public static async Task CompressAsync(string destinationPath, IEnumerable<string> filePaths)
		{
			ValidateCompressParameters(destinationPath, filePaths);

			await Task.Run(async () =>
			{
				using var zipMemoryStream = new MemoryStream();
				using var zipArchive = new ZipArchive(zipMemoryStream, ZipArchiveMode.Create, true);

				foreach (var eachPath in filePaths)
				{
					if (File.Exists(eachPath) == false)
						continue;

					var eachFileName = Path.GetFileName(eachPath);
					var zipEntity = zipArchive.CreateEntry(eachFileName);

					using var entryStream = zipEntity.Open();
					using var readStream = File.OpenRead(eachPath);

					await readStream.CopyToAsync(entryStream);
					await entryStream.FlushAsync();
				}

				// Seen Comment : 여기서 명시적으로 Dispose 하지 않으면
				// 나중에 압축 할 때 "Unexpected end of data" 오류가 발생한다.
				zipArchive.Dispose();

				using var zipFileStream = new FileStream(destinationPath, FileMode.Create);
				zipMemoryStream.Seek(0, SeekOrigin.Begin);

				await zipMemoryStream.CopyToAsync(zipFileStream);
				await zipFileStream.FlushAsync();
			});
		}

		/// <summary>
		/// 파일들을 별도 스레드에서 동기로 ZIP 압축합니다.
		/// </summary>
		/// <param name="destinationPath">생성할 ZIP 파일 경로</param>
		/// <param name="filePaths">압축할 파일 경로들</param>
		public static async Task CompressAsyncFast(string destinationPath, IEnumerable<string> filePaths)
		{
			await Task.Run(() =>
			{
				Compress(destinationPath, filePaths);
			});
		}

		/// <summary>
		/// ZIP 파일을 압축 해제합니다.
		/// </summary>
		/// <param name="zipFilePath">압축을 해제할 ZIP 파일 경로</param>
		/// <param name="extractPath">압축을 해제할 대상 디렉토리</param>
		public static void Decompress(string zipFilePath, string extractPath)
		{
			ValidateDecompressParameters(zipFilePath, extractPath);

			using var zipArchive = ZipFile.Open(zipFilePath, ZipArchiveMode.Update);
			zipArchive.ExtractToDirectory(extractPath, true);
		}

		/// <summary>
		/// ZIP 파일을 비동기로 압축 해제합니다.
		/// </summary>
		/// <param name="zipFilePath">압축을 해제할 ZIP 파일 경로</param>
		/// <param name="extractPath">압축을 해제할 대상 디렉토리</param>
		public static async Task DecompressAsync(string zipFilePath, string extractPath)
		{
			ValidateDecompressParameters(zipFilePath, extractPath);

			await Task.Run(async () =>
			{
				using var archive = ZipFile.OpenRead(zipFilePath);
				foreach (var entry in archive.Entries)
				{
					var destinationPath = Path.Combine(extractPath, entry.FullName);
					var destinationDirectory = Path.GetDirectoryName(destinationPath);

					if (Directory.Exists(destinationDirectory) == false)
						Directory.CreateDirectory(destinationDirectory);

					using var entryStream = entry.Open();
					using var fileStream = File.Create(destinationPath);
					await entryStream.CopyToAsync(fileStream);
				}
			});
		}

		/// <summary>
		/// ZIP 파일을 별도 스레드에서 동기로 압축 해제합니다.
		/// </summary>
		/// <param name="zipFilePath">압축을 해제할 ZIP 파일 경로</param>
		/// <param name="extractPath">압축을 해제할 대상 디렉토리</param>
		public static async Task DecompressAsyncFast(string zipFilePath, string extractPath)
		{
			await Task.Run(() =>
			{
				Decompress(zipFilePath, extractPath);
			});
		}

		private static void ValidateCompressParameters(string destinationPath, IEnumerable<string> filePaths)
		{
			if (string.IsNullOrWhiteSpace(destinationPath))
				throw new ArgumentException("Destination path cannot be null or empty.", nameof(destinationPath));

			if (filePaths == null)
				throw new ArgumentNullException(nameof(filePaths));

			var directory = Path.GetDirectoryName(destinationPath);
			if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
				Directory.CreateDirectory(directory);
		}

		private static void ValidateDecompressParameters(string zipFilePath, string extractPath)
		{
			if (string.IsNullOrWhiteSpace(zipFilePath))
				throw new ArgumentException("Zip file path cannot be null or empty.", nameof(zipFilePath));

			if (string.IsNullOrWhiteSpace(extractPath))
				throw new ArgumentException("Extract path cannot be null or empty.", nameof(extractPath));

			if (File.Exists(zipFilePath) == false)
				throw new FileNotFoundException("Zip file not found.", zipFilePath);

			if (Directory.Exists(extractPath) == false)
				Directory.CreateDirectory(extractPath);
		}
	}
}
```
